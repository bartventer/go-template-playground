//go:build js && wasm
// +build js,wasm

package playground

import (
	"syscall/js"

	"github.com/bartventer/go-template-playground/internal/jsutil"
)

// SuccessResponse returns a successful response for the given action.
func (a Action) SuccessResponse(data []byte) js.Value {
	return js.ValueOf(map[string]interface{}{
		"action": a.String(),
		"data":   jsutil.MakeUint8Array(data),
	})
}

// ErrorResponse returns an error response for the given action.
func (a Action) ErrorResponse(errMessage string) js.Value {
	return js.ValueOf(map[string]interface{}{
		"action": a.String(),
		"error":  errMessage,
	})
}
