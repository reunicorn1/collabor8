#!/usr/bin/env bash

function showHelp() {
    echo "Usage: migrateDB [migrationName]"
    echo "Create a new migration file or run migrations"
    echo "Options:"
    echo "  -h  Display help"
    echo "  -r  Run the migration after creating it"
    echo "  -u  Revert the last migration"
    echo "  -c  Clear all migrations"
    echo "  -g  Generate a new migration file"
    echo "  -s  Show all migrations"
}

function migrateDB() {
    local migration_name=""
    local runFlag=false
    local generateFlag=false

    while getopts ":cghrsu" opt; do
        case ${opt} in
            c )
                echo "Clearing all migrations..."
                rm -rf ./db/migrations/*.ts
                exit 0
                ;;
            h )
                showHelp
                exit 0
                ;;
            g )
                generateFlag=true
                ;;
            r )
                runFlag=true
                ;;
            s )
                echo "Showing all migrations..."
                npm run migration:show
                exit 0
                ;;
            u )
                echo "Reverting the last migration..."
                npm run migration:revert
                exit 0
                ;;
            \? )
                echo "Invalid Option: -$OPTARG" 1>&2
                exit 1
                ;;
        esac
    done
    shift $((OPTIND -1))
    
    migration_name="$1"

    if [ -z "$migration_name" ]; then
        echo "Error: Missing migration name"
        showHelp
        exit 1
    fi

    if [ "$generateFlag" = true ]; then
        echo "Generating a new migration file... $migration_name"
        npm run migration:generate --name="$migration_name"
    else
        echo "Creating a new migration file... $migration_name"
        npm run migration:create --name="$migration_name"
        
        if [ "$runFlag" = true ]; then
            echo "Running the migration..."
            npm run migration:run
        fi
    fi
}

migrateDB "$@"

