#!/usr/bin/env bash

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
        exit 1
    fi
}

# Function to check and install dependencies for changed package.json files
check_and_install_dependencies() {
    local branch_name=$1
    git fetch origin

    # Compare package.json files between current and remote branch
    local changed_dirs=$(git diff --name-only origin/"$branch_name" | grep 'package.json' | xargs -I{} dirname {} | sort | uniq)

    if [ -z "$changed_dirs" ]; then
        echo "No changes detected in package.json files."
        return
    fi

    echo "Detected changes in package.json files in the following directories:"
    echo "$changed_dirs"

    for dir in $changed_dirs; do
        echo "Installing dependencies in directory: $dir"
        (cd "$dir" && npm install)
    done
}

# Function to handle merge conflicts by opening the conflicting files in Neovim
handle_merge_conflicts() {
    local conflicts=$(git diff --name-only --diff-filter=U)
    if [ -n "$conflicts" ]; then
        echo "Merge conflicts detected in the following files:"
        echo "$conflicts"
        meld $conflicts
    else
        echo "No merge conflicts detected."
    fi
}

# Function to fetch branches and select one interactively
fetch_and_select_branch() {
    echo "Fetching all branches..."
    git fetch --all

    echo "Select a branch to switch to (local) or checkout (remote):"
    selected_branch=$(git branch -a | fzf --height 15 --border --ansi --preview "git log --oneline {}" | sed 's/\* //g' | sed 's/remotes\/origin\///g')

    selected_branch=$(echo "$selected_branch" | xargs)

    if [ -z "$selected_branch" ]; then
        echo "No branch selected."
        exit 1
    fi

    # Check if the branch is local or remote and switch/checkout accordingly
    if git branch --list | grep -q "$selected_branch"; then
        echo "Switching to local branch: $selected_branch"
        git switch "$selected_branch"
    else
        echo "Checking out remote branch: $selected_branch"
        git checkout -t origin/"$selected_branch"
        # Check and install dependencies if the -r option is true
        if [ "$checkout_remote_branch" = true ]; then
            check_and_install_dependencies "$selected_branch"
        fi
    fi
}

# Function to pull latest changes and check/update dependencies
pull_and_check_dependencies() {
    local branch_name=$1
    git fetch origin

    # Check if there are updates to pull
    local local_commit=$(git rev-parse "$branch_name")
    local remote_commit=$(git rev-parse origin/"$branch_name")

    if [ "$local_commit" != "$remote_commit" ]; then
        echo "Pulling latest changes for branch: $branch_name"
        git pull origin "$branch_name"
        
        # Handle merge conflicts if any
        handle_merge_conflicts

        # Check and install dependencies
        check_and_install_dependencies "$branch_name"
    else
        echo "No updates to pull for branch: $branch_name"
    fi
}
# Parse options
while getopts "cfprh-" opt; do
    case ${opt} in
        c)
            create_branch=true
            ;;
        f)
            fetch_branch=true
            ;;
        p)
            pull_and_update=true
            ;;
        r)
            checkout_remote_branch=true
            ;;
        h | -)
            show_help
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            show_help
            ;;
    esac
done
shift $((OPTIND -1))

# Function to create a new branch interactively
create_branch_interactively() {
    echo "Enter the new branch name (must start with 'chore/', 'feat/', 'fixbug/', or 'hotfix/'):"
    read branch_name
    validate_branch_name "$branch_name"
    echo "Creating branch: $branch_name"
    git checkout -b "$branch_name"
    # git push -u origin "$branch_name"
}

# Check if options that need branch selection are used
if [ "$create_branch" = true ]; then
    create_branch_interactively
fi

if [ "$fetch_branch" = true ] || [ "$pull_and_update" = true ] || [ "$checkout_remote_branch" = true ]; then
    fetch_and_select_branch
fi

# Pull latest changes and check/update dependencies
if [ "$pull_and_update" = true ]; then
    pull_and_check_dependencies "$selected_branch"
fi

# # Checkout (load) the branch
# if [ "$checkout_branch" = true ]; then
#     echo "Checking out branch: $selected_branch"
#     git checkout "$selected_branch"
# fi

# Checkout a remote branch
if [ "$checkout_remote_branch" = true ]; then
    echo "Checking out remote branch: $selected_branch"
    git fetch origin "$selected_branch"
    git checkout -t origin/"$selected_branch"
    # Check and install dependencies if the -r option is true
    check_and_install_dependencies "$selected_branch"
fi

echo "Operation completed."

