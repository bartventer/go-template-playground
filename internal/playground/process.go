//go:build js && wasm
// +build js,wasm

package playground

import (
	"bytes"
	"fmt"
	"strconv"
	"sync"
	"syscall/js"
	"text/template"

	"github.com/bartventer/go-template-playground/internal/codec"
	"github.com/bartventer/go-template-playground/internal/jsutil"
	"github.com/bartventer/go-template-playground/internal/tmpl"
)

var (
	templatePool   sync.Pool
	dataReaderPool sync.Pool
	dataBufPool    sync.Pool
	initPoolsOnce  sync.Once
)

func initPools() {
	initPoolsOnce.Do(func() {
		templatePool = sync.Pool{
			New: func() interface{} {
				return template.New("template").Funcs(tmpl.TemplateFuncs())
			},
		}
		dataReaderPool = sync.Pool{
			New: func() interface{} {
				return new(bytes.Reader)
			},
		}
		dataBufPool = sync.Pool{
			New: func() interface{} {
				return new(bytes.Buffer)
			},
		}
	})
}

// processTemplate is a JavaScript function that processes a template with a context.
// It reads the template and context data from byte arrays and writes the result
// to a byte array. The context data is decoded using the specified format.
//
// Parameters:
//   - this: The JavaScript value representing the context in which the function is called.
//   - args: A slice of JavaScript values containing the template data, context data, and format.
//
// Returns:
//   - A JavaScript object containing the processed template data or an error message.
//
// TypeScript signature:
//
//	declare function processTemplate(
//	  /** The byte array containing the template data. */
//	  templateView: Uint8Array,
//	  /** The byte array containing the context data. */
//	  dataView: Uint8Array,
//	  /** The format of the context data. */
//	  format: Format,
//	): { action: "processTemplate"; data: Uint8Array } | { action: "processTemplate"; error: string };
func processTemplate(this js.Value, args []js.Value) (result any) {
	defer func() {
		if r := recover(); r != nil {
			result = ActionProcessTemplate.ErrorResponse("recovered from panic: " + fmt.Sprint(r))
		}
	}()

	if len(args) != 3 {
		return ActionProcessTemplate.ErrorResponse("expected 3 arguments, got " + strconv.Itoa(len(args)))
	}

	tmplView, dataView, format := args[0], args[1], args[2]
	tmplBytes, n := jsutil.CopyUint8Array(&tmplView)
	if n == 0 {
		return ActionProcessTemplate.SuccessResponse([]byte{})
	}

	dataBytes, _ := jsutil.CopyUint8Array(&dataView)
	resultBytes, err := processTemplateBytes(tmplBytes, dataBytes, format.String())
	if err != nil {
		return ActionProcessTemplate.ErrorResponse(err.Error())
	}

	return ActionProcessTemplate.SuccessResponse(resultBytes)
}

func processTemplateBytes(tmplBytes, ctxBytes []byte, format string) ([]byte, error) {
	initPools()
	ctxReader := dataReaderPool.Get().(*bytes.Reader)
	ctxReader.Reset(ctxBytes)
	defer dataReaderPool.Put(ctxReader)

	decoder := codec.NewDecoder(ctxReader, codec.Format(format))
	var ctxData interface{}
	if err := decoder.Decode(&ctxData); err != nil {
		return nil, fmt.Errorf("error decoding context data: %w", err)
	}

	tmpl, err := templatePool.Get().(*template.Template).Parse(string(tmplBytes))
	if err != nil {
		return nil, fmt.Errorf("error parsing template: %w", err)
	}
	defer templatePool.Put(tmpl)

	resultBuf := dataBufPool.Get().(*bytes.Buffer)
	resultBuf.Reset()
	defer dataBufPool.Put(resultBuf)

	if err := tmpl.Execute(resultBuf, ctxData); err != nil {
		return nil, fmt.Errorf("error executing template: %w", err)
	}

	return resultBuf.Bytes(), nil
}
