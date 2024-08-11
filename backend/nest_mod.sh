#!/usr/bin/env bash
# generate nest module, controller, service, and entity based on options

help() {
  echo "Usage: $0 [module_name] [-m] [-s] [-c] [-e] [-a]"
  echo
  echo "Generate a new Nest module, service, controller, and/or entity."
  echo "Options:"
  echo "  -m              Generate a module with the provided name."
  echo "  -s              Generate a service with the provided name."
  echo "  -c              Generate a controller with the provided name."
  echo "  -e              Generate an entity with the provided name."
  echo "  -a              Generate all (module, service, controller, and entity)."
  echo "  -h, --help      Display this help message."
  echo
  exit 1
}

gen_entity() {
  module_name="$1"
  entity_dir="src/${module_name}"
  entity_file="${entity_dir}/${module_name}.entity.ts"

  # Check if the directory exists; if not, create it
  if [ ! -d "$entity_dir" ]; then
    echo "Directory does not exist. Creating: $entity_dir"
    mkdir -p "$entity_dir"
  fi

  echo "Generating entity: $entity_file"
  cat <<EOL > "$entity_file"
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ${module_name} {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Add other columns here
}
EOL
}




generate_module=false
generate_service=false
generate_controller=false
generate_entity=false

while getopts "hmscea-:" opt; do
  case $opt in
    -)
      case $OPTARG in
        help)
          help
          ;;
      esac
      ;;
    m)
      generate_module=true
      ;;
    s)
      generate_service=true
      ;;
    c)
      generate_controller=true
      ;;
    e)
      generate_entity=true
      ;;
    a)
      generate_module=true
      generate_service=true
      generate_controller=true
      generate_entity=true
      ;;
    h)
      help
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

shift $((OPTIND -1))

if [ "$#" -ne 1 ]; then
  echo "What's your module name?"
  read -rp '➡️  '
  module_name="$REPLY"
else
  module_name="$1"
fi

if [ "$generate_module" = true ]; then
  nest g module "$module_name"
fi

if [ "$generate_service" = true ]; then
  nest g service "$module_name"
fi

if [ "$generate_controller" = true ]; then
  nest g controller "$module_name"
fi

if [ "$generate_entity" = true ]; then
  gen_entity "$module_name"
fi
