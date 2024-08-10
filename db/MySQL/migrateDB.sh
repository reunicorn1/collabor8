#!/usr/bin/env bash
function showHelp() {
	echo "Usage: migrateDB [migrationName]"
	echo "Create a new migration file"
	echo "Options:"
	echo "  -h  Display help"
	echo "  -r  Run the migration after creating it"
	echo "  -u  Revert the last migration"
	echo "  -c  clear all migration"
}


function migrateDB() {
	local migration_name=""
	dataSource="src/data-source.ts"
	MIGRATION_DIR="src/migration"
	runFlag=false

	while getopts ":cg:hru" opt; do
		case ${opt} in
			c )
				echo "Clearing all migrations..."
				rm -rf "$MIGRATION_DIR"/*.ts
				exit 0
				;;
			h )
				showHelp
				exit 0
				;;
			g )
				echo "Generate migration file..."
				npx typeorm migration:generate "$OPTARG" -d "$dataSource"
				exit 0
				;;
			r )
				runFlag=true
				;;
			u )
				echo "Revert the last migration..."
				npm run migrate:revert -- -d "$dataSource"
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

	echo "Creating a new migration file... $migration_name"
	# Create a new migration file
	npx typeorm migration:create "$MIGRATION_DIR/$migration_name"
	# Run the migration
	if [ "$runFlag" = true ]; then
		echo "Running the migration..."
		npm run migration:run -- -d "$dataSource"
	fi
}

migrateDB "$@"
