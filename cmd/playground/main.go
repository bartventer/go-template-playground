//go:build js && wasm
// +build js,wasm

package main

// Playground is a WebAssembly module that provides functions for processing Go templates.
//
// See [playground] for information.
import (
	"github.com/bartventer/go-template-playground/internal/playground"
)

func main() {
	playground.InitModule()
}
