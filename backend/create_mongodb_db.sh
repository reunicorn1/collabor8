#!/usr/bin/env bash

# Function to display help message
display_help() {
    echo "Usage: $0 [-d <database_name>] [-c <collection_name>] [-h]"
    echo
    echo "Options:"
    echo "  -d <database_name>  Specify the database name to create."
    echo "  -c <collection_name> (Optional) Specify the collection name to create in the database."
    echo "  -h                  Display this help message."
    exit 1
}

# Default values
DB_NAME=""
COL_NAME=""

# Parse command-line options
while getopts ":d:c:h" opt; do
    case ${opt} in
        d)
            DB_NAME=$OPTARG
            ;;
        c)
            COL_NAME=$OPTARG
            ;;
        h)
            display_help
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            display_help
            ;;
        :)
            echo "Option -$OPTARG requires an argument." >&2
            display_help
            ;;
    esac
done

# Check if database name is provided
if [ -z "$DB_NAME" ]; then
    echo "Database name is required."
    display_help
fi

# Create the database
# Use `mongosh` to run the commands
if [ -n "$COL_NAME" ]; then
    # Create the database and collection
    mongosh --eval "
        use ${DB_NAME};
        db.${COL_NAME}.insertOne({ name: 'initialData' });
    " > /dev/null
    if [ $? -eq 0 ]; then
        echo "Database '${DB_NAME}' and collection '${COL_NAME}' created successfully."
    else
        echo "Failed to create database or collection."
        exit 1
    fi
else
    # Create the database without collection
    mongosh --eval "use ${DB_NAME};" > /dev/null
    if [ $? -eq 0 ]; then
        echo "Database '${DB_NAME}' created successfully."
    else
        echo "Failed to create database."
        exit 1
    fi
fi
