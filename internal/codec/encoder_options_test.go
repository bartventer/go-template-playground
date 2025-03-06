//go:build js && wasm
// +build js,wasm

package codec

import (
	"strings"
	"syscall/js"
	"testing"

	"github.com/bartventer/go-template-playground/internal/jsutil"
	"github.com/bartventer/go-template-playground/internal/util"
	"github.com/stretchr/testify/assert"
)

func TestEncoderOptions_init(t *testing.T) {
	type fields struct {
		InsertSpaces bool
		IndentSize   int
	}
	tests := []struct {
		name   string
		fields fields
		want   EncoderOptions
	}{
		{
			name: "Default settings with spaces",
			fields: fields{
				InsertSpaces: true,
				IndentSize:   0,
			},
			want: EncoderOptions{
				InsertSpaces: true,
				IndentSize:   DefaultIndentSize,
			},
		},
		{
			name: "Default settings with tabs",
			fields: fields{
				InsertSpaces: false,
				IndentSize:   0,
			},
			want: EncoderOptions{
				InsertSpaces: false,
				IndentSize:   DefaultTabSize,
			},
		},
		{
			name: "Custom indent size below maximum",
			fields: fields{
				InsertSpaces: true,
				IndentSize:   4,
			},
			want: EncoderOptions{
				InsertSpaces: true,
				IndentSize:   4,
			},
		},
		{
			name: "Negative indent size",
			fields: fields{
				InsertSpaces: true,
				IndentSize:   0,
			},
			want: EncoderOptions{
				InsertSpaces: true,
				IndentSize:   DefaultIndentSize,
			},
		},
		{
			name: "Indent size above maximum",
			fields: fields{
				InsertSpaces: true,
				IndentSize:   10,
			},
			want: EncoderOptions{
				InsertSpaces: true,
				IndentSize:   MaxIndentSize,
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			o := &EncoderOptions{
				InsertSpaces: tt.fields.InsertSpaces,
				IndentSize:   tt.fields.IndentSize,
			}
			o.init()
			assert.Equal(t, tt.want, *o)
		})
	}
}

func TestEncoderOptions_indent(t *testing.T) {
	type fields struct {
		InsertSpaces bool
		IndentSize   int
		NoIndent     bool
	}
	tests := []struct {
		name   string
		fields fields
		wantS  string
	}{
		{
			name: "No indent",
			fields: fields{
				NoIndent: true,
			},
			wantS: "",
		},
		{
			name: "Spaces with default indent size",
			fields: fields{
				InsertSpaces: true,
				IndentSize:   DefaultIndentSize,
			},
			wantS: strings.Repeat(" ", DefaultIndentSize),
		},
		{
			name: "Tabs with default indent size",
			fields: fields{
				InsertSpaces: false,
				IndentSize:   DefaultIndentSize,
			},
			wantS: strings.Repeat("\t", DefaultIndentSize),
		},
		{
			name: "Spaces with custom indent size",
			fields: fields{
				InsertSpaces: true,
				IndentSize:   4,
			},
			wantS: strings.Repeat(" ", 4),
		},
		{
			name: "Tabs with custom indent size",
			fields: fields{
				InsertSpaces: false,
				IndentSize:   6,
			},
			wantS: strings.Repeat("\t", 6),
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			o := &EncoderOptions{
				InsertSpaces: tt.fields.InsertSpaces,
				IndentSize:   tt.fields.IndentSize,
			}
			assert.Equal(t, tt.wantS, o.indent())
		})
	}
}

func TestEncoderOptions_UnmarshalJS(t *testing.T) {
	type fields struct {
		InsertSpaces bool
		IndentSize   int
	}
	type args struct {
		data util.JSValuer
	}
	tests := []struct {
		name      string
		fields    fields
		args      args
		assertion assert.ErrorAssertionFunc
	}{
		{
			name: "Valid",
			fields: fields{
				InsertSpaces: true,
				IndentSize:   4,
			},
			args: args{
				data: jsutil.JSValueWrapper{
					Value: js.ValueOf(map[string]interface{}{
						"indentSize":   4,
						"insertSpaces": true,
					}),
				},
			},
			assertion: assert.NoError,
		},
		{
			name:      "Invalid",
			fields:    fields{},
			args:      args{data: jsutil.JSValueWrapper{Value: js.ValueOf("not an object")}},
			assertion: assert.Error,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			o := &EncoderOptions{
				InsertSpaces: tt.fields.InsertSpaces,
				IndentSize:   tt.fields.IndentSize,
			}
			tt.assertion(t, o.UnmarshalJS(tt.args.data))
		})
	}
}
