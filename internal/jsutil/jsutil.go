//go:build js && wasm
// +build js,wasm

// Package jsutil provides utility functions for interacting with [syscall/js].
package jsutil

import (
	"syscall/js"
)

var unint8ArrayConstructor = js.Global().Get("Uint8Array")

// getUint8ArrayLength returns the length of a [Uint8Array]. Will panic if the input is not a [Uint8Array].
//
// [Uint8Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
func getUint8ArrayLength(view *js.Value) int {
	return view.Get("byteLength").Int()
}

// MakeUint8Array creates a new [Uint8Array] from a byte slice.
//
// [Uint8Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
func MakeUint8Array(bytes []byte) js.Value {
	dst := unint8ArrayConstructor.New(len(bytes))
	js.CopyBytesToJS(dst, bytes)
	return dst
}

// CopyUint8Array copies the contents of a [Uint8Array] to a byte slice.
// It returns the byte slice and the number of bytes copied.
//
// [Uint8Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
func CopyUint8Array(buffer *js.Value) ([]byte, int) {
	dst := make([]byte, getUint8ArrayLength(buffer))
	n := js.CopyBytesToGo(dst, *buffer)
	return dst, n
}
