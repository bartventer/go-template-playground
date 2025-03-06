//go:build js && wasm
// +build js,wasm

package jsutil

import (
	"syscall/js"

	"github.com/bartventer/go-template-playground/internal/util"
)

var _ util.JSValuer = JSValueWrapper{}

// JSValueWrapper implements the [util.JSValuer] interface.
type JSValueWrapper struct {
	js.Value
}

func (w JSValueWrapper) Get(key string) util.JSValuer {
	return JSValueWrapper{w.Value.Get(key)}
}
