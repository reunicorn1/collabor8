#!/bin/bash

# Set the project directory
PROJECT_DIR="/home/ubuntu/collabor8/backend"

# Define colors for output messages
RED='\e[31m'
GREEN='\e[32m'
YELLOW='\e[33m'
BLUE='\e[34m'
NC='\e[0m' # No Color

# Navigate to the project directory
cd "$PROJECT_DIR" || exit

# Pull the latest changes from the GitHub repository
echo -e "${BLUE}Pulling latest changes from GitHub...${NC}"
if ! git pull origin main; then
	echo -e "${RED}Error encountered during git pull. Exiting deployment.${NC}"
	exit 1
fi

# Install any new dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
if ! npm install; then
	echo -e "${RED}Error encountered during npm install. Exiting deployment.${NC}"
	exit 1
fi

# Fix vulnerabilities
echo -e "${YELLOW}Fixing vulnerabilities...${NC}"
npm audit fix

# Build the NestJS project
echo -e "${BLUE}Building the project...${NC}"
if ! npm run build; then
	echo -e "${RED}Error encountered during npm build. Exiting deployment.${NC}"
	exit 1
fi

# Use PM2 to start or restart the application using the ecosystem configuration
echo -e "${BLUE}Starting or restarting the application with PM2 using ecosystem.config.js...${NC}"
if ! pm2 startOrRestart ecosystem.config.js --env production; then
	echo -e "${RED}Error encountered during PM2 start/restart. Exiting deployment.${NC}"
	exit 1
fi

# Install docker dependencies if Docker is not installed
if ! command -v docker >/dev/null 2>&1; then
	echo -e "${BLUE}Installing docker dependencies...${NC}"
	./docker/install.sh
fi

echo -e "${GREEN}Deployment completed successfully.${NC}"
