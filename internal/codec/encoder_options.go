package codec

import (
	"cmp"
	"strings"

	"github.com/bartventer/go-template-playground/internal/util"
)

// Default options.
const (
	DefaultTabSize    = 4
	DefaultIndentSize = 2

	MaxIndentSize = 8
)

// EncoderOptions holds configuration settings for the encoder.
type EncoderOptions struct {
	InsertSpaces bool // Use spaces instead of tabs.
	IndentSize   int  // Number of spaces or tabs to insert per indent.
	NoIndent     bool // Do not indent the output.
}

func (o *EncoderOptions) init() {
	if o.InsertSpaces {
		o.IndentSize = min(
			cmp.Or(max(o.IndentSize, 0), DefaultIndentSize),
			MaxIndentSize,
		)
	} else {
		o.IndentSize = min(
			cmp.Or(max(o.IndentSize, 0), DefaultTabSize),
			MaxIndentSize,
		)
	}
}

// indent returns a string s containing the indentation characters.
func (o *EncoderOptions) indent() (s string) {
	if o.NoIndent {
		return ""
	}
	s = "\t"
	if o.InsertSpaces {
		s = " "
	}
	return strings.Repeat(s, o.IndentSize)
}

// Unmarshalls the javascript object into an EncoderOptions struct.
func (o *EncoderOptions) UnmarshalJS(data util.JSValuer) (err error) {
	defer func() {
		if r := recover(); r != nil {
			err = r.(error)
		}
	}()
	o.InsertSpaces = data.Get("insertSpaces").Truthy()
	if data.Get("indentSize").Truthy() {
		o.IndentSize = data.Get("indentSize").Int()
	}
	o.NoIndent = data.Get("noIndent").Truthy()
	return nil
}
