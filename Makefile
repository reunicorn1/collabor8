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

setup: check-dependencies # setup the project and install core tools system-level

check-dependencies:
ifndef TMUX
	sudo apt-get update
	sudo apt-get install -y tmux
endif

ifndef NPM
	sudo apt-get update
	sudo apt-get install -y npm
	# insall backend, frontend plugins
	$(NPM) $(FRONTEND) i
	$(NPM) $(BACKEND) i
endif

ifeq ($(MAKECMDGOALS), run)
run:
		$(call run_session,$(REACT),$(FRONTEND))
		$(call run_session,$(NEST),$(BACKEND))
endif

ifeq ($(MAKECMDGOALS), stop)
stop:
	$(call kill_session,$(REACT))
	$(call kill_session,$(NEST))
endif
ifeq ($(MAKECMDGOALS), stop_react)
stop_react:
	$(call kill_session,$(REACT))
endif
ifeq ($(MAKECMDGOALS), stop_nest)
stop_nest:
	$(call kill_session,$(NEST))
endif

list:
	@$(TMUX) ls # list running processes
restart: stop run
	@echo "$(BOLD)Restarted$(RESET)"
run_react: run
run_nest: run
stop_react: stop
stop_nest: stop
