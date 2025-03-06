//go:build js && wasm
// +build js,wasm

// Package playground is a WebAssembly module that provides functions for transforming data and processing
// Go templates.
//
// See [codec] for information about the supported formats.
// See [tmpl] for the supported template functions.
package playground

import "syscall/js"

// Function names.
const (
	FuncNameTransformData   = "transformData"
	FuncNameProcessTemplate = "processTemplate"
)

// InitModule initializes the WebAssembly module.
func InitModule() {
	for name, fn := range map[string]js.Func{
		FuncNameTransformData:   js.FuncOf(transformData),
		FuncNameProcessTemplate: js.FuncOf(processTemplate),
	} {
		defer fn.Release()
		js.Global().Set(name, fn)
	}

	select {}
}
