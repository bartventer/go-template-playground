//go:build js && wasm
// +build js,wasm

package playground

import (
	"syscall/js"
	"testing"

	"github.com/bartventer/go-template-playground/internal/jsutil"
	"github.com/stretchr/testify/assert"
)

var transformTestCases = []struct {
	name       string
	args       []js.Value
	expected   string
	shouldFail bool
	errorMsg   string
}{
	{
		name: "Panic",
		args: []js.Value{
			js.ValueOf("not a Uint8Array"),
			js.ValueOf("json"),
		},
		shouldFail: true,
		errorMsg:   "recovered from panic",
	},
	{
		name:       "ArgumentError",
		args:       []js.Value{},
		shouldFail: true,
		errorMsg:   "expected 2 to 4 arguments",
	},
	{
		name: "ValidConversion",
		args: []js.Value{
			jsutil.MakeUint8Array([]byte(`{"key": "value"}`)),
			js.ValueOf("json"),
			js.ValueOf("yaml"),
		},
		expected: "key: value\n",
	},
	{
		name: "DefaultNextFormat",
		args: []js.Value{
			jsutil.MakeUint8Array([]byte(`{"key": "value"}`)),
			js.ValueOf("json"),
		},
		expected: "{\n\t\t\t\t\"key\": \"value\"\n}\n",
	},
	{
		name: "EncoderOptions",
		args: []js.Value{
			jsutil.MakeUint8Array([]byte(`{"key": "value"}`)),
			js.ValueOf("json"),
			js.Undefined(),
			js.ValueOf(map[string]interface{}{
				"insertSpaces": true,
				"indentSize":   1,
			}),
		},
		expected: "{\n \"key\": \"value\"\n}\n",
	},
	{
		name: "EncoderOptionsError",
		args: []js.Value{
			jsutil.MakeUint8Array([]byte(`{"key": "value"}`)),
			js.ValueOf("json"),
			js.Undefined(),
			js.ValueOf("not an object"),
		},
		shouldFail: true,
		errorMsg:   "syscall/js: call of Value.Get on string",
	},
	{
		name: "ParseError",
		args: []js.Value{
			jsutil.MakeUint8Array([]byte(`{"key": "value"`)), // Invalid JSON.
			js.ValueOf("json"),
			js.ValueOf("yaml"),
		},
		shouldFail: true,
		errorMsg:   "error decoding data from format json",
	},
	{
		name: "UnsupportedFormatError",
		args: []js.Value{
			jsutil.MakeUint8Array([]byte(`{"key": "value"}`)),
			js.ValueOf("json"),
			js.ValueOf("unsupported"),
		},
		shouldFail: true,
		errorMsg:   "error encoding data to format unsupported",
	},
}

func Test_transformData(t *testing.T) {
	for _, tc := range transformTestCases {
		t.Run(tc.name, func(t *testing.T) {
			result := transformData(js.Value{}, tc.args)
			if tc.shouldFail {
				err := result.(js.Value).Get("error").String()
				assert.Contains(t, err, tc.errorMsg)
			} else {
				data := result.(js.Value).Get("data")
				resultBytes, _ := jsutil.CopyUint8Array(&data)
				assert.Equal(t, tc.expected, string(resultBytes))
			}
		})
	}
}
