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
YARN_WORKSPACE ?= www
WWW_DIR = $(WORKSPACE)/www
PUBLIC_DIR = $(WWW_DIR)/public
WWW_WASM_DIR = $(PUBLIC_DIR)/wasm
WWW_LIB_DIR = $(WWW_DIR)/src/lib
WWW_WORKERS_DIR = $(WWW_DIR)/src/workers

# WebAssembly
WASM_EXEC_SRC_PATH = $(shell go env GOROOT)/lib/wasm/wasm_exec.js
PLAYGROUND_WASM_BIN_PATH = $(WWW_WORKERS_DIR)/playground.wasm
PLAYGROUND_WASM_EXEC_PATH = $(WWW_LIB_DIR)/go/wasm_exec.js

# ==============================================================================
# Build Configuration
# ==============================================================================
GOOS = js
GOARCH = wasm
GOFLAGS ?=
export GOOS GOARCH GOFLAGS

# Binary names
PLAYGROUND_BINARY = playground.wasm

# Versioning
VERSION ?= $(shell git describe --tags --abbrev=0 --dirty 2>/dev/null || echo "v0.0.0-$(shell git rev-list --count HEAD)")
DATE = $(shell date -u '+%Y-%m-%d_%H:%M:%S')
COMMIT = $(shell git rev-parse HEAD)

# Flags
LDFLAGS = -ldflags "-s -w"
BUILDFLAGS = -v -trimpath

# ==============================================================================
# Coverage Configuration
# ==============================================================================
COVERPROFILE ?= coverage.out
COVERAGE_DIR = $(TMP_DIR)/coverage
COVERAGE_HTML = $(COVERAGE_DIR)/coverage.html
SHASUM := $(if $(shell command -v sha256sum 2>/dev/null),sha256sum,shasum)

# ==============================================================================
# Vite Configuration
# ==============================================================================
VITE_APP_VERSION ?= $(VERSION)
VITE_APP_DATE ?= $(DATE)
VITE_APP_COMMIT ?= $(COMMIT)
VITE_APP_BASE_URL ?= $(if $(CI),/go-template-playground/,/)
ROLLUP_VISUALIZER_PATH = $(TMP_DIR)/rollup-visualizer.html
export VITE_APP_VERSION VITE_APP_DATE VITE_APP_COMMIT VITE_APP_BASE_URL ROLLUP_VISUALIZER_PATH

# ==============================================================================
# Functions
# ==============================================================================
define build_wasm
	CGO_ENABLED=0 go build $(LDFLAGS) $(BUILDFLAGS) -o $(1) $(2)
	mv -f $(1) $(3)
endef

# ==============================================================================
# Targets
# ==============================================================================

.PHONY: install/wasm
install/wasm: ## Install go dependencies
	go mod download -x
	go mod verify

.PHONY: install/www
install/www: ## Install gui dependencies
	yarn install

.PHONY: install
install: install/wasm install/www ## Install dependencies

.PHONY: update/wasm
update/wasm: ## Update go dependencies
	go get -u -v -tags=tools ./...  
	go mod tidy -v
	go mod download -x
	go mod verify

.PHONY: update/www
update/www: ## Update gui dependencies
	yarn upgrade

.PHONY: update
update: update/wasm update/www ## Update dependencies

.PHONY: generate/wasm
generate/wasm: export GOOS =
generate/wasm: export GOARCH =
generate/wasm: ## Generate code from go directives
	go generate ./...

.PHONY: generate/www
generate/www: ## Generate code from gui directives
	yarn workspace $(YARN_WORKSPACE) generate

.PHONY: generate
generate: generate/wasm generate/www ## Generate code

.PHONY: lint/wasm
lint/wasm: ## Run linter
	golangci-lint run --verbose --timeout=5m

.PHONY: lint/www
lint/www: ## Run linter
	yarn workspace $(YARN_WORKSPACE) lint
	
.PHONY: fmt/wasm
fmt/wasm: ## Format code
	golangci-lint run --fix --verbose --timeout=5m

.PHONY: fmt/www
fmt/www: ## Format code
	yarn workspace $(YARN_WORKSPACE) format

.PHONY: test/wasm
test/wasm: PATH := $(PATH):$(shell dirname $(WASM_EXEC_SRC_PATH))
test/wasm: ## Run tests for go code
	@mkdir -pv $(COVERAGE_DIR)
	go test -v --coverpkg=./... -cover -outputdir=$(COVERAGE_DIR) -coverprofile=$(COVERPROFILE) -run= ./...
	@echo "📊 Coverage report: $(COVERAGE_HTML)"
ifeq ($(CI),)
	go tool cover -html=$(COVERAGE_DIR)/$(COVERPROFILE) -o $(COVERAGE_HTML)
	@echo "🌐 Run 'make cover/browser' to open coverage report in browser"
endif

.PHONY: bench/wasm
bench/wasm: PATH := $(PATH):$(shell dirname $(WASM_EXEC_SRC_PATH))
bench/wasm: ## Run benchmarks for go code
	go test -v -bench=. -benchmem -benchtime=3s ./... | tee -a $(TMP_DIR)/bench.txt

.PHONY: test/www
test/www: ## Run tests for gui code
	yarn workspace $(YARN_WORKSPACE) test

.PHONY: browser/cover
browser/cover: ## Open browser with go code coverage
	xdg-open $(COVERAGE_HTML)

.PHONY: build/wasm
build/wasm: PLAYGROUND_BINARY := $(TMP_DIR)/$(PLAYGROUND_BINARY)
build/wasm: ## Build WebAssembly code
	mkdir -pv $(dir $(PLAYGROUND_WASM_BIN_PATH)) $(dir $(PLAYGROUND_WASM_EXEC_PATH))
	$(call build_wasm,$(PLAYGROUND_BINARY),$(CMD_DIR)/playground,$(PLAYGROUND_WASM_BIN_PATH))
	cp -f $(WASM_EXEC_SRC_PATH) $(PLAYGROUND_WASM_EXEC_PATH)
	@echo "📦 WebAssembly build output:"
	du -h $(PLAYGROUND_WASM_BIN_PATH) $(PLAYGROUND_WASM_EXEC_PATH) | sort -h 

.PHONY: build/www
build/www: ## Build gui code
	yarn workspace $(YARN_WORKSPACE) build

.PHONY: build
build: build/wasm build/www ## Build project

.PHONY: browser/rollup
browser/rollup: ## Open browser with rollup visualizer
	xdg-open $(ROLLUP_VISUALIZER_PATH)

.PHONY: dev
dev: build/wasm ## Run local development server
	yarn workspace $(YARN_WORKSPACE) dev

.PHONY: serve
serve: ## Run local production server
	yarn workspace $(YARN_WORKSPACE) serve

.PHONY: clean
clean: ## Clean project
	-rm -rfv node_modules $(TMP_DIR) $(WWW_DIR)/dist $(WWW_DIR)/dev-dist $(dir $(PLAYGROUND_WASM_BIN_PATH))
	go clean -cache -testcache -modcache
	yarn cache clean

.PHONY: help
help: ## Show this help message
	@printf 'Usage: make <target>\n'
	@echo ''
	@echo 'Targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\t\033[36m%-15s\033[0m %s\n", $$1, $$2}'

print-%  : ; @echo $* = $($*)