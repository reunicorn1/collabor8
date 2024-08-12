# Makefile for NestJS Application

# Default goal
.DEFAULT_GOAL := help

# Command variables
NPM := npm

# Commands
start: ## Start the NestJS application
	$(NPM) run start

dev: ## Start the NestJS application in development mode
	$(NPM) run start:dev

debug: ## Start the NestJS application in debug mode
	$(NPM) run start:debug

install: ## Install all dependencies
	$(NPM) install

build: ## Build the NestJS application
	$(NPM) run build

lint: ## Lint the code
	$(NPM) run lint

test: ## Run tests
	$(NPM) run test

clean: ## Clean the build directory
	rm -rf dist

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

