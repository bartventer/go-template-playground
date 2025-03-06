//go:build js && wasm
// +build js,wasm

package playground

import (
	"syscall/js"
	"testing"

	"github.com/bartventer/go-template-playground/internal/jsutil"
	"github.com/bartventer/go-template-playground/internal/testutil"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

var processTestCases = []struct {
	name                string
	args                []js.Value
	expected            string
	shouldFail          bool
	errorMsg            string
	skipBytesProcessing bool
}{
	{
		name: "ArgumentError",
		args: []js.Value{
			js.ValueOf("not a Uint8Array"),
		},
		shouldFail:          true,
		errorMsg:            "expected 3 arguments",
		skipBytesProcessing: true,
	},
	{
		name: "Panic",
		args: []js.Value{
			js.ValueOf("not a Uint8Array"),
			js.Undefined(),
			js.Undefined(),
		},
		shouldFail:          true,
		errorMsg:            "recovered from panic",
		skipBytesProcessing: true,
	},
	{
		name: "EmptyTemplate",
		args: []js.Value{
			jsutil.MakeUint8Array([]byte("")),
			jsutil.MakeUint8Array([]byte(`{"Name": "World"}`)),
			js.ValueOf("json"),
		},
		expected: "",
	},
	{
		name: "ValidTemplate",
		args: []js.Value{
			jsutil.MakeUint8Array([]byte("Hello, {{.Name}}!")),
			jsutil.MakeUint8Array([]byte(`{"Name": "World"}`)),
			js.ValueOf("json"),
		},
		expected: "Hello, World!",
	},
	{
		name: "DecodeError",
		args: []js.Value{
			jsutil.MakeUint8Array([]byte("Hello, {{.Name}}!")),
			jsutil.MakeUint8Array([]byte(`{"Name": "World"`)), // Invalid JSON (missing closing bracket).
			js.ValueOf("json"),
		},
		shouldFail: true,
		errorMsg:   "error decoding context data",
	},
	{
		name: "ParseError",
		args: []js.Value{
			jsutil.MakeUint8Array([]byte("Hello, {{.Name")), // Invalid template syntax (missing closing bracket).
			jsutil.MakeUint8Array([]byte(`{"Name": "World"}`)),
			js.ValueOf("json"),
		},
		shouldFail: true,
		errorMsg:   "error parsing template",
	},
	{
		name: "ExecutionError",
		args: []js.Value{
			jsutil.MakeUint8Array([]byte("Hello, {{.Name true}}!")), // Invalid template syntax (unexpected token).
			jsutil.MakeUint8Array([]byte(`{"Name": "World"}`)),
			js.ValueOf("json"),
		},
		shouldFail: true,
		errorMsg:   "error executing template",
	},
}

func Test_processTemplate(t *testing.T) {
	for _, tc := range processTestCases {
		t.Run(tc.name, func(t *testing.T) {
			result := processTemplate(js.Value{}, tc.args)
			if tc.shouldFail {
				err := result.(js.Value).Get("error").String()
				assert.Contains(t, err, tc.errorMsg)
			} else {
				resultBytes, _ := jsutil.CopyUint8Array(testutil.Ptr(result.(js.Value).Get("data")))
				assert.Equal(t, tc.expected, string(resultBytes))
			}
		})
	}
}

func Test_processTemplateBytes(t *testing.T) {
	for _, tc := range processTestCases {
		if tc.skipBytesProcessing {
			t.Skip("skipping test that requires byte array copying")
		}
		t.Run(tc.name, func(t *testing.T) {
			tmplBytes, _ := jsutil.CopyUint8Array(testutil.Ptr(tc.args[0]))
			dataBytes, _ := jsutil.CopyUint8Array(testutil.Ptr(tc.args[1]))
			format := tc.args[2].String()
			result, err := processTemplateBytes(tmplBytes, dataBytes, format)
			if tc.shouldFail {
				require.Error(t, err)
				assert.Contains(t, err.Error(), tc.errorMsg)
			} else {
				require.NoError(t, err)
				assert.Equal(t, tc.expected, string(result))
			}
		})
	}
}
