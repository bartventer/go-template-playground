//go:build js && wasm
// +build js,wasm

package playground

import (
	"bytes"
	"fmt"
	"strconv"
	"syscall/js"

	"github.com/bartventer/go-template-playground/internal/codec"
	"github.com/bartventer/go-template-playground/internal/jsutil"
)

// transformData transforms data from one format to another, handling different formats and optional encoder options.
//
// This function takes a Uint8Array as input data and transforms it from a specified format to another format.
// It supports optional encoder options for customizing the transformation process. If the target format is not provided,
// it defaults to the source format. The function ensures proper error handling and recovers from any panics that may occur.
//
// Parameters:
//   - this: The JavaScript value representing the current context (not used).
//   - p: A slice of JavaScript values representing the function arguments.
//   - p[0]: The data to transform, expected to be a Uint8Array.
//   - p[1]: The format of the data, expected to be a Format.
//   - p[2] (optional): The format to convert the data to, defaults to prevFormat if not provided.
//   - p[3] (optional): Encoder options, expected to be an object.
//
// Returns:
//   - result: An interface{} that contains either the transformed data as a Uint8Array or an error message.
//
// TypeScript signature:
//
//	interface EncoderOptions {
//	   insertSpaces?: number;
//	   indentSize?: number;
//	   noIndent?: boolean;
//	}
//
//	declare function transformData(
//	   /** The data to transform. */
//	   data: Uint8Array, // Argument 0
//	   /** The format of the data. */
//	   prevFormat: Format, // Argument 1
//	   /** Optional: The format to convert the data to, defaults to prevFormat. */
//	   nextFormat?: Format, // Argument 2
//	   /** Optional: Encoder options. */
//	   options?: EncoderOptions, // Argument 3
//	 ): { action: "transformData"; data: Uint8Array } | { action: "transformData"; error: string };
func transformData(this js.Value, p []js.Value) (result interface{}) {
	defer func() {
		if r := recover(); r != nil {
			result = ActionTransformData.ErrorResponse("recovered from panic: " + fmt.Sprint(r))
		}
	}()

	if len(p) < 2 || len(p) > 4 {
		return ActionTransformData.ErrorResponse("expected 2 to 4 arguments, got " + strconv.Itoa(len(p)))
	}

	// Required arguments.
	dataView, prevFormat := p[0], p[1]

	// Optional arguments.
	var nextFormat js.Value
	var options *codec.EncoderOptions
	switch len(p) {
	case 4:
		if optionsJS := p[3]; optionsJS.Type() != js.TypeUndefined {
			options = new(codec.EncoderOptions)
			if err := options.UnmarshalJS(jsutil.JSValueWrapper{Value: optionsJS}); err != nil {
				return ActionTransformData.ErrorResponse(err.Error())
			}
		}
		fallthrough
	case 3:
		nextFormat = p[2]
		if nextFormat.IsUndefined() {
			nextFormat = prevFormat
		}
	case 2:
		nextFormat = prevFormat
	}

	dataBytes, _ := jsutil.CopyUint8Array(&dataView)
	resultBytes, err := transformDataBytes(
		dataBytes,
		codec.Format(prevFormat.String()),
		codec.Format(nextFormat.String()),
		options,
	)
	if err != nil {
		return ActionTransformData.ErrorResponse(err.Error())
	}

	return ActionTransformData.SuccessResponse(resultBytes)
}

func transformDataBytes(data []byte, prevFormat, nextFormat codec.Format, options *codec.EncoderOptions) ([]byte, error) {
	initPools()
	dataReader := dataReaderPool.Get().(*bytes.Reader)
	dataReader.Reset(data)
	defer dataReaderPool.Put(dataReader)

	decoder := codec.NewDecoder(dataReader, prevFormat)

	var intermediateValue interface{}
	if err := decoder.Decode(&intermediateValue); err != nil {
		return nil, fmt.Errorf("error decoding data from format %s: %w", prevFormat, err)
	}

	// Encode the intermediate value into the target format.
	dataBuf := dataBufPool.Get().(*bytes.Buffer)
	defer dataBufPool.Put(dataBuf)
	dataBuf.Reset()

	encoder := codec.NewEncoder(dataBuf, nextFormat, options)
	if err := encoder.Encode(intermediateValue); err != nil {
		return nil, fmt.Errorf("error encoding data to format %s: %w", nextFormat, err)
	}

	return dataBuf.Bytes(), nil
}
