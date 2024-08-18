# Makefile for the Application front & back
.PHONY: run setup stop restart
.DEFAULT_GOAL := help

# commands
TMUX := $(shell command -v tmux 2> /dev/null)
NPM := $(shell command -v npm 2> /dev/null)
# colors
RED := \e[31m
GREEN := \e[32m
BOLD := \e[1m
RESET := \e[0m
# sessions
REACT := ReactJS
NEST := NestJS

# scripts
FRONTEND := npm --prefix frontend run dev
BACKEND := npm --prefix backend run start:dev

# run define (kinda like procedure)
# 1st argument is the session name
# 2nd argument is the script associated w/ the session
define run_session
@$(TMUX) new-session -d -s "$(1)" "$(2)"
@echo -e '$(1) app is $(GREEN)running \e[5m\e[1m...\e[0m$(RESET)'
endef

# kill session base on its name
# 1st argument is the session's name
define kill_session
@$(TMUX) kill-session -t "$(1)"
@echo -e '$(1) app has $(RED)stopped!$(RESET)'
endef

setup: ## setup the project and install core tools on system-level as well as application dependencies
	@$(MAKE) -s check-dependencies

check-dependencies:
ifndef TMUX
	sudo apt-get update
	sudo apt-get install -y tmux
endif

ifndef NPM
	sudo apt-get update
	sudo apt-get install -y npm
	# install app-level dependencies
	$(NPM) $(FRONTEND) i
	$(NPM) $(BACKEND) i
endif

run: ## runs the whole application sesions (front/back)
	$(call run_session,$(REACT),$(FRONTEND))
	$(call run_session,$(NEST),$(BACKEND))
run_react: ## runs react app only on tmux detached session
	$(call run_session,$(REACT),$(FRONTEND))
run_nest: ## runs nestjs app only on tmux detached session
	$(call run_session,$(NEST),$(BACKEND))
stop: ## stop the whole application sessions (front/back)
	$(call kill_session,$(REACT))
	$(call kill_session,$(NEST))
stop_react: ## stop react app session
	$(call kill_session,$(REACT))
stop_nest: ## stop nestjs app session 
	$(call kill_session,$(NEST))

list: ## list running sessions
	@$(TMUX) ls # list running processes
restart: ## restart the whole application
	@$(MAKE) -s stop run && \
	echo "$(BOLD)Restarted$(RESET)"
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
