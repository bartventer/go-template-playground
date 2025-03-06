// Package codec provides encoding and decoding functions for multiple data formats.
//
// Supported formats: JSON, YAML, TOML.
package codec

import (
	"encoding/json"
	"fmt"
	"io"

	"github.com/BurntSushi/toml"
	"gopkg.in/yaml.v3"
)

// Format represents a supported data format.
type Format string

// Supported formats.
const (
	FormatJSON Format = "json"
	FormatYAML Format = "yaml"
	FormatTOML Format = "toml"
)

// Decoder reads JSON, YAML, or TOML values from an input stream.
type Decoder struct {
	r      io.Reader
	format Format
}

// NewDecoder creates a new decoder.
func NewDecoder(r io.Reader, format Format) *Decoder {
	return &Decoder{r: r, format: format}
}

// Decode reads the data from the input stream.
func (d *Decoder) Decode(v interface{}) error {
	return decode(d.r, v, d.format)
}

// decode reads the data from the input stream in the specified format.
func decode(r io.Reader, v interface{}, format Format) error {
	switch format {
	case FormatJSON:
		return json.NewDecoder(r).Decode(v)
	case FormatYAML:
		return yaml.NewDecoder(r).Decode(v)
	case FormatTOML:
		_, err := toml.NewDecoder(r).Decode(v)
		return err
	default:
		return fmt.Errorf("unsupported format: %s", format)
	}
}

// Encoder writes JSON, YAML, or TOML values to an output stream.
type Encoder struct {
	w       io.Writer
	format  Format
	options *EncoderOptions
}

// NewEncoder creates a new encoder.
func NewEncoder(w io.Writer, format Format, options *EncoderOptions) *Encoder {
	if options == nil {
		options = &EncoderOptions{}
	}
	options.init()
	return &Encoder{w, format, options}
}

// Encode writes the data to the output stream.
func (e *Encoder) Encode(data interface{}) error {
	return encode(e.w, data, e.format, e.options)
}

// encode writes the data to the output stream in the specified format.
func encode(w io.Writer, data interface{}, format Format, options *EncoderOptions) error {
	indent := options.indent()

	switch format {
	case FormatJSON:
		e := json.NewEncoder(w)
		e.SetIndent("", indent)
		return e.Encode(data)
	case FormatYAML:
		e := yaml.NewEncoder(w)
		e.SetIndent(options.IndentSize)
		return e.Encode(data)
	case FormatTOML:
		e := toml.NewEncoder(w)
		e.Indent = indent
		return e.Encode(data)
	default:
		return fmt.Errorf("unsupported format: %s", format)
	}
}
