//go:build js && wasm
// +build js,wasm

// Package testutil provides utility functions for testing WebAssembly modules.
package testutil

import (
	"cmp"
	"syscall/js"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

// Ptr returns a pointer to the input value.
func Ptr[i any](x i) *i {
	return &x
}

// WaitForGlobalFuncOption is a configuration option for the WaitForGlobalFunc function.
type WaitForGlobalFuncOption func(*waitForGlobalFuncConfig)

type waitForGlobalFuncConfig struct {
	timeout    time.Duration
	assertions []func(js.Value) assert.ValueAssertionFunc
}

// WithTimeout sets the timeout for the WaitForGlobalFunc function.
func WithTimeout(timeout time.Duration) WaitForGlobalFuncOption {
	return func(cfg *waitForGlobalFuncConfig) {
		cfg.timeout = timeout
	}
}

// WithAssertion adds a custom assertion to the WaitForGlobalFunc function.
func WithAssertion(assertion func(js.Value) assert.ValueAssertionFunc) WaitForGlobalFuncOption {
	return func(cfg *waitForGlobalFuncConfig) {
		cfg.assertions = append(cfg.assertions, assertion)
	}
}

// WaitForGlobalFunc waits for a global JavaScript function to be defined,
// or times out after the specified duration. It can also run custom assertions.
func WaitForGlobalFunc(t *testing.T, funcName string, opts ...WaitForGlobalFuncOption) {
	t.Helper()

	cfg := &waitForGlobalFuncConfig{
		timeout: 5 * time.Second,
	}

	for _, opt := range opts {
		opt(cfg)
	}

	valueCh := make(chan js.Value, 1)

	go func() {
		for {
			if js.Global().Get(funcName).Truthy() {
				valueCh <- js.Global().Get(funcName)
				return
			}
			time.Sleep(10 * time.Millisecond)
		}
	}()

	select {
	case value := <-valueCh:
		for _, assertion := range cfg.assertions {
			assertion(value)(t, value)
		}
	case <-time.After(cmp.Or(max(cfg.timeout, 0), 5*time.Second)):
		t.Fatalf("timeout waiting for global function %q", funcName)
	}
}
