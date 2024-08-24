# Makefile for the Application (Frontend & Backend)

# Default target
.DEFAULT_GOAL := help

# Commands
TMUX := $(shell which tmux 2> /dev/null)
NPM := $(shell which npm 2> /dev/null)
NODEMON := $(shell which nodemon 2> /dev/null)
# Colors
RED := \e[31m
GREEN := \e[32m
BOLD := \e[1m
RESET := \e[0m

# Sessions
REACT_SESSION := ReactJS
NEST_SESSION := NestJS
SOCKET_SESSION := SocketIO

# Scripts
FRONTEND_SCRIPT := npm --prefix frontend run dev
BACKEND_SCRIPT := npm --prefix backend run start:dev
SOCKET_SCRIPT := nodemon socket_server/newserver.js

# Define run session
define run_session
	@$(TMUX) new-session -d -s "$(1)" "$(2)"
	@echo -e '$(1) app is $(GREEN)running \e[5m\e[1m...\e[0m$(RESET)'
endef

# Define kill session
define kill_session
	@if $(TMUX) ls | grep -q "$(1)"; then \
		$(TMUX) kill-session -t "$(1)"; \
		echo '$(1) app has $(RED)stopped!$(RESET)'; \
	else \
		echo 'No tmux session named "$(1)" found.'; \
	fi
endef

# Check environment
check-environment:
	@if [ -z "$(TMUX)" ]; then \
		echo "Error: tmux is not installed. Please install tmux.";
		exit 1; \
	fi
	@if [ -z "$(NPM)" ]; then \
		echo "Error: npm is not installed. Please install npm."; \
		exit 1; \
	fi

# Target to set up the project
setup: ## Setup project and install core tools and dependencies
	# @$(MAKE) -s check-environment
	@$(MAKE) -s check-dependencies || exit 1

# Check and install dependencies
check-dependencies:
	@if [ -z "$(TMUX)" ]; then \
		echo "Installing tmux..."; \
		sudo apt-get update && sudo apt-get install -y tmux; \
	fi
	@if [ -z "$(NPM)" ]; then \
		echo "Installing npm..."; \
		sudo apt-get update && sudo apt-get install -y npm; \
		echo "Installing project dependencies..."; \
		$(NPM) --prefix frontend install; \
		$(NPM) --prefix backend install; \
		$(NPM) --prefix socket_server install; \
	fi

# Clean project dependencies
clean: ## Clean project dependencies
	@echo "Removing node_modules and reinstalling dependencies..."
	@rm -rf frontend/node_modules
	@rm -rf backend/node_modules
	@rm -rf socket_server/node_modules
	@$(MAKE) setup

# Run sessions
run: ## Run frontend and backend in tmux sessions
	$(call run_session,$(REACT_SESSION),$(FRONTEND_SCRIPT))
	$(call run_session,$(NEST_SESSION),$(BACKEND_SCRIPT))
	$(call run_session,$(SOCKET_SESSION),$(SOCKET_SCRIPT))

run_react: ## Run React app in a tmux session
	$(call run_session,$(REACT_SESSION),$(FRONTEND_SCRIPT))

run_nest: ## Run NestJS app in a tmux session
	$(call run_session,$(NEST_SESSION),$(BACKEND_SCRIPT))

run_socket: ## Run SocketIO server in a tmux session
	$(call run_session,$(SOCKET_SESSION),$(SOCKET_SCRIPT))

# Stop sessions
stop: ## Stop all running sessions
	$(call kill_session,$(REACT_SESSION))
	$(call kill_session,$(NEST_SESSION))
	$(call kill_session,$(SOCKET_SESSION))

stop_react: ## Stop React app session
	$(call kill_session,$(REACT_SESSION))

stop_nest: ## Stop NestJS app session
	$(call kill_session,$(NEST_SESSION))

stop_socket: ## Stop SocketIO server session
	$(call kill_session,$(SOCKET_SESSION))
# List running tmux sessions
list: ## List all running tmux sessions
	@$(TMUX) ls

# Check status
status: ## Check the status of tmux sessions
	@$(TMUX) ls || echo "No tmux sessions running."

# Restart application
restart: ## Restart all sessions
	@$(MAKE) -s stop run && \
	echo "$(BOLD)Restarted$(RESET)"

# Test targets
test_frontend: ## Run frontend tests
	@$(NPM) --prefix frontend run test

test_backend: ## Run backend tests
	@$(NPM) --prefix backend run test

test: ## Run all tests
	$(MAKE) test_frontend
	$(MAKE) test_backend

# Docker targets
docker-build: ## Build Docker images for frontend and backend
	@docker build -t my-frontend-image frontend/
	@docker build -t my-backend-image backend/

docker-push: ## Push Docker images to repository
	@docker push my-frontend-image
	@docker push my-backend-image

# Version and info
version: ## Display project version
	@echo "Project Version: 1.0.0"

info: ## Display project information
	@echo "Frontend script: $(FRONTEND_SCRIPT)"
	@echo "Backend script: $(BACKEND_SCRIPT)"

# Help message
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
