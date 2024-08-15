#!/usr/bin/env bash

# Function to display help
show_help() {
    echo "Usage: $0 [options] <branch-name>"
    echo
    echo "Options:"
    echo "  -c  Create a new branch"
    echo "  -f  Fetch the latest changes from remote and interactively select a branch"
    echo "  -p  Load (checkout) the branch"
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
            checkout_branch=true
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
    fi
}

# Check if branch name is provided
if [ -z "$1" ] && [ "$create_branch" != true ] && [ "$checkout_branch" != true ] && [ "$fetch_branch" != true ]; then
    echo "Error: Branch name is required."
    show_help
fi

# Validate branch name
if [ "$create_branch" = true ] || [ "$checkout_branch" = true ]; then
    branch_name=$1
    validate_branch_name "$branch_name"
fi

# Create the branch
if [ "$create_branch" = true ]; then
    echo "Creating branch: $branch_name"
    git checkout -b "$branch_name"
    # git push -u origin "$branch_name"
fi

# Fetch branches and select one to switch/checkout
if [ "$fetch_branch" = true ]; then
    fetch_and_select_branch
fi

# Checkout (load) the branch
if [ "$checkout_branch" = true ]; then
    echo "Checking out branch: $branch_name"
    git checkout "$branch_name"
fi

# Checkout a remote branch
if [ "$checkout_remote_branch" = true ]; then
    echo "Checking out remote branch: $branch_name"
    git fetch origin "$branch_name"
    git checkout -t origin/"$branch_name"
fi

echo "Operation completed."

