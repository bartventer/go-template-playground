SHELL = /usr/bin/env bash
.SHELLFLAGS = -ecuo pipefail
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
MAKEFLAGS += --no-builtin-variables
.DEFAULT_GOAL := help

# ==============================================================================
# Environment Variables
# ==============================================================================
CI ?=
GITHUB_WORKSPACE ?=

# ==============================================================================
# Workspace and Directory Paths
# ==============================================================================
WORKSPACE = $(or $(GITHUB_WORKSPACE),$(shell git rev-parse --show-toplevel))
export WORKSPACE
TMP_DIR = $(WORKSPACE)/tmp
CMD_DIR = $(WORKSPACE)/cmd

# Web
WWW_DIRNAME = www
WWW_DIR = $(WORKSPACE)/$(WWW_DIRNAME)
WWW_SRC_DIR = $(WWW_DIR)/src
YARN_WORKSPACE_CMD = yarn workspace $(WWW_DIRNAME)

# WebAssembly
GO_WASM_EXEC_JS = $(shell go env GOROOT)/lib/wasm/wasm_exec.js
WWW_WASM_BIN = $(WWW_SRC_DIR)/workers/playground.wasm
WWW_WASM_EXEC_JS = $(WWW_SRC_DIR)/lib/go/wasm_exec.js

# ==============================================================================
# Build Configuration
# ==============================================================================
GOOS = js
GOARCH = wasm
GOFLAGS ?=
export GOOS GOARCH GOFLAGS

# Flags
LDFLAGS = -ldflags "-s -w"
BUILDFLAGS = -v -trimpath

# ==============================================================================
# Coverage Configuration
# ==============================================================================
COVERPROFILE ?= coverage.out
COVERAGE_DIR ?= $(TMP_DIR)/coverage
COVERAGE_HTML = $(COVERAGE_DIR)/coverage.html

# ==============================================================================
# Vite Configuration
# ==============================================================================
VITE_APP_VERSION ?= $(shell git describe --tags --abbrev=0 --dirty 2>/dev/null || echo "v0.0.0-$(shell git rev-list --count HEAD)")
VITE_APP_DATE = $(shell date -u '+%Y-%m-%d_%H:%M:%S')
VITE_APP_COMMIT = $(shell git rev-parse HEAD)
VITE_APP_BASE_URL ?= $(if $(CI),/go-template-playground/,/)
ROLLUP_VISUALIZER_PATH = $(TMP_DIR)/rollup-visualizer.html
export VITE_APP_VERSION VITE_APP_DATE VITE_APP_COMMIT VITE_APP_BASE_URL ROLLUP_VISUALIZER_PATH

# ==============================================================================
# Functions
# ==============================================================================
define open_browser
	@case $$(uname -s) in \
		Linux) xdg-open $(1) ;; \
		Darwin) open $(1) ;; \
		*) echo "Unsupported platform" ;; \
	esac
endef

# ==============================================================================
# Targets
# ==============================================================================

## Install:
.PHONY: install/wasm
install/wasm: ## Install Go dependencies
	go mod download -x
	go mod verify

.PHONY: install/www
install/www: ## Install GUI dependencies
	yarn install

.PHONY: install
install: install/wasm install/www ## Install dependencies

## Update:
.PHONY: update/wasm
update/wasm: ## Update Go dependencies
	go get -u -v -tags=tools ./...  
	go mod tidy -v
	go mod download -x
	go mod verify

.PHONY: update/www
update/www: ## Update GUI dependencies
	yarn upgrade

.PHONY: update
update: update/wasm update/www ## Update dependencies

## Generate:
.PHONY: generate/wasm
generate/wasm: export GOOS =
generate/wasm: export GOARCH =
generate/wasm: ## Generate code from Go directives
	go generate ./...

.PHONY: generate/www
generate/www: ## Generate code from GUI directives
	$(YARN_WORKSPACE_CMD) generate

.PHONY: generate
generate: generate/wasm generate/www ## Generate code

## Lint:
.PHONY: lint/wasm
lint/wasm: ## Run Go linter
	golangci-lint run --verbose --timeout=5m

.PHONY: lint/www
lint/www: ## Run GUI linter
	$(YARN_WORKSPACE_CMD) lint

## Format:
.PHONY: fmt/wasm
fmt/wasm: ## Format Go code
	golangci-lint run --fix --verbose --timeout=5m

.PHONY: fmt/www
fmt/www: ## Format GUI code
	$(YARN_WORKSPACE_CMD) format

## Test:
.PHONY: test/wasm
test/wasm: PATH := $(PATH):$(shell dirname $(GO_WASM_EXEC_JS))
test/wasm: ## Run tests for Go code
	@mkdir -pv $(COVERAGE_DIR)
	go test -v --coverpkg=./... -cover -outputdir=$(COVERAGE_DIR) -coverprofile=$(COVERPROFILE) -run= ./...
	@echo
	du -h $(COVERAGE_DIR)/$(COVERPROFILE)
	@echo "📊 Coverage report: $(COVERAGE_HTML)"
ifeq ($(CI),)
	go tool cover -html=$(COVERAGE_DIR)/$(COVERPROFILE) -o $(COVERAGE_HTML)
	@echo "🌐 Run 'make cover/browser' to open coverage report in browser"
endif

.PHONY: bench/wasm
bench/wasm: PATH := $(PATH):$(shell dirname $(GO_WASM_EXEC_JS))
bench/wasm: ## Run benchmarks for Go code
	go test -v -bench=. -benchmem -benchtime=3s ./... | tee -a $(TMP_DIR)/bench.txt

.PHONY: test/www
test/www: ## Run tests for GUI code
	$(YARN_WORKSPACE_CMD) test

.PHONY: browser/cover
browser/cover: ## Open browser with Go coverage report
	$(call open_browser,$(COVERAGE_HTML))

## Build:
.PHONY: build/wasm
build/wasm: ## Build WebAssembly code
	@mkdir -pv $(dir $(WWW_WASM_BIN)) $(dir $(WWW_WASM_EXEC_JS))
	CGO_ENABLED=0 go build $(LDFLAGS) $(BUILDFLAGS) -o $(WWW_WASM_BIN) $(CMD_DIR)/playground
	@cp -f $(GO_WASM_EXEC_JS) $(WWW_WASM_EXEC_JS)
	@echo "📦 WebAssembly build output:"
	@du -h $(WWW_WASM_BIN) $(WWW_WASM_EXEC_JS) | sort -h 

.PHONY: build/www
build/www: ## Build GUI code
	$(YARN_WORKSPACE_CMD) build

.PHONY: build
build: build/wasm build/www ## Build project

.PHONY: browser/rollup
browser/rollup: ## Open browser with Rollup visualizer
	$(call open_browser,$(ROLLUP_VISUALIZER_PATH))

.PHONY: dev
dev: build/wasm ## Run local development server
	$(YARN_WORKSPACE_CMD) dev

.PHONY: serve
serve: ## Run local production server
	$(YARN_WORKSPACE_CMD) serve

.PHONY: clean
clean: ## Clean project
	-rm -rfv $(TMP_DIR) $(WWW_DIR)/dist $(WWW_DIR)/dev-dist $(WWW_WASM_BIN) $(WWW_WASM_EXEC_JS)
	go clean -cache -testcache -modcache
	yarn cache clean

# ==============================================================================
# Colors
# ==============================================================================

## Help:
.PHONY: help
help: GREEN  := $(shell tput -Txterm setaf 2)
help: YELLOW := $(shell tput -Txterm setaf 3)
help: CYAN   := $(shell tput -Txterm setaf 6)
help: RESET  := $(shell tput -Txterm sgr0)
help: ## Show this help
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} { \
		if (/^[a-zA-Z0-9_\/-]+:.*?##.*$$/) {printf "    ${YELLOW}%-20s${GREEN}%s${RESET}\n", $$1, $$2} \
		else if (/^## .*$$/) {printf "  ${CYAN}%s${RESET}\n", substr($$1,4)} \
		}' $(MAKEFILE_LIST)