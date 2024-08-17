#!/usr/bin/env bash

log_file="branch_manager.log"
exec 2> >(tee -a "$log_file" >&2)

# Function to display help
show_help() {
	echo "Usage: $0 [options]"
	echo
	echo "Options:"
	echo "  -c  Create a new branch"
	echo "  -f  Fetch the latest changes from remote and interactively select a branch"
	echo "  -p  Pull the latest changes for the branch and check/update dependencies"
	echo "  -r  Checkout a remote branch"
	echo "  -h  Show this help message"
	echo "  -v  Enable verbose output"
	echo
	echo "Branch name should be prepended with one of the following:"
	echo "  chore/, feat/, fixbug/, hotfix/"
	echo
	exit 1
}

# Function to validate branch name
validate_branch_name() {
	local branch_name=$1
	if [[ ! $branch_name =~ ^(chore/|feat/|fixbug/|hotfix/).+ ]]; then
		echo "Error: Invalid branch name. Branch name must start with 'chore/', 'feat/', 'fixbug/', or 'hotfix/'."
		return 1
	fi
	return 0
}

# Function to check and install dependencies for changed package.json files
check_and_install_dependencies() {
	local branch_name=$1
	if ! command -v npm &>/dev/null; then
		echo "npm command not found. Please install Node.js and npm."
		exit 1
	fi
	git fetch origin

	local changed_dirs=$(git diff --name-only origin/"$branch_name" | grep 'package.json' | xargs -I{} dirname {} | sort | uniq)
	if [ -z "$changed_dirs" ]; then
		echo "No changes detected in package.json files."
		return
	fi

	echo "Detected changes in package.json files in the following directories:"
	echo "$changed_dirs"

	for dir in $changed_dirs; do
		echo "Installing dependencies in directory: $dir"
		(cd "$dir" && npm install) || {
			echo "Failed to install dependencies in $dir"
			exit 1
		}
	done
}

# Function to handle merge conflicts by opening the conflicting files in Meld
handle_merge_conflicts() {
	local conflicts=$(git diff --name-only --diff-filter=U)
	if [ -n "$conflicts" ]; then
		echo "Merge conflicts detected in the following files:"
		echo "$conflicts"
		echo "Opening conflicts in Meld..."

		# Check if Meld is installed
		if ! command -v meld &>/dev/null; then
			echo "Meld is not installed. Please install Meld to resolve conflicts."
			exit 1
		fi

		# Open conflicts with Meld
		meld $conflicts
	else
		echo "No merge conflicts detected."
	fi
}

# Function to fetch branches and select one interactively
fetch_and_select_branch() {
	echo "Fetching all branches..."
	git fetch --all || {
		echo "Failed to fetch branches"
		exit 1
	}

	echo "Select a branch to switch to (local) or checkout (remote). Press Ctrl+C to cancel."
	selected_branch=$(git branch -a | fzf --height 15 --border --ansi --preview "git log --oneline {}" | sed 's/\* //g' | sed 's/remotes\/origin\///g' | xargs)

	if [ -z "$selected_branch" ]; then
		echo "No branch selected."
		exit 1
	fi

	if git branch --list | grep -q "$selected_branch"; then
		echo "Switching to local branch: $selected_branch"
		git switch "$selected_branch" || {
			echo "Failed to switch to branch $selected_branch"
			exit 1
		}
	else
		echo "Checking out remote branch: $selected_branch"
		git checkout -t origin/"$selected_branch" || {
			echo "Failed to checkout remote branch $selected_branch"
			exit 1
		}
	fi
}

# Function to pull latest changes and check/update dependencies
pull_and_check_dependencies() {
	local branch_name=$1
	git fetch origin || {
		echo "Failed to fetch latest changes"
		exit 1
	}

	local local_commit=$(git rev-parse "$branch_name")
	local remote_commit=$(git rev-parse origin/"$branch_name")

	if [ "$local_commit" != "$remote_commit" ]; then
		echo "Pulling latest changes for branch: $branch_name"
		git pull origin "$branch_name" || {
			echo "Failed to pull latest changes for branch $branch_name"
			exit 1
		}

		handle_merge_conflicts
		check_and_install_dependencies "$branch_name"
	else
		echo "No updates to pull for branch: $branch_name"
	fi
}

# Function to create a new branch interactively
create_branch_interactively() {
	local branch_name
	while true; do
		echo "Enter the new branch name (must start with 'chore/', 'feat/', 'fixbug/', or 'hotfix/'):"
		read -r branch_name
		if validate_branch_name "$branch_name"; then
			echo "Creating branch: $branch_name"
			git checkout -b "$branch_name" || {
				echo "Failed to create branch $branch_name"
				exit 1
			}
			return
		else
			echo "Invalid branch name. Please try again."
		fi
	done
}

# Parse options
verbose=false
while getopts "cfprhv" opt; do
	case ${opt} in
	c) create_branch=true ;;
	f) fetch_branch=true ;;
	p) pull_and_update=true ;;
	r) checkout_remote_branch=true ;;
	v) verbose=true ;;
	h | -) show_help ;;
	\?)
		echo "Invalid option: -$OPTARG" >&2
		show_help
		;;
	esac
done
shift $((OPTIND - 1))

# Main script logic
if [ "$create_branch" = true ]; then
	create_branch_interactively
fi

if [ "$fetch_branch" = true ] || [ "$pull_and_update" = true ] || [ "$checkout_remote_branch" = true ]; then
	fetch_and_select_branch
fi

if [ "$pull_and_update" = true ]; then
	pull_and_check_dependencies "$selected_branch"
fi

if [ "$checkout_remote_branch" = true ]; then
	check_and_install_dependencies "$selected_branch"
fi

echo "Operation completed."
