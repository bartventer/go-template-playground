package codec

import (
	"bytes"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDecoder_Decode(t *testing.T) {
	tests := []struct {
		name    string
		format  Format
		data    string
		want    interface{}
		wantErr bool
	}{
		{
			"JSON",
			FormatJSON,
			`{"key": "value"}`,
			map[string]interface{}{"key": "value"},
			false,
		},
		{
			"YAML",
			FormatYAML,
			"key: value\n",
			map[string]interface{}{"key": "value"},
			false,
		},
		{
			"TOML",
			FormatTOML,
			"key = \"value\"\n",
			map[string]interface{}{"key": "value"},
			false,
		},
		{
			"Unsupported",
			"unsupported",
			"key = value",
			nil,
			true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := bytes.NewReader([]byte(tt.data))
			d := NewDecoder(r, tt.format)
			var got map[string]interface{}
			err := d.Decode(&got)
			if (err != nil) != tt.wantErr {
				t.Errorf("Decoder.Decode() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr {
				assert.Equal(t, tt.want, got)
			}
		})
	}
}

func TestEncoder_Encode(t *testing.T) {
	tests := []struct {
		name    string
		format  Format
		data    interface{}
		options *EncoderOptions
		want    string
		wantErr bool
	}{
		{
			"JSON",
			FormatJSON,
			map[string]interface{}{"key": "value"},
			&EncoderOptions{InsertSpaces: true, IndentSize: 2},
			"{\n  \"key\": \"value\"\n}\n",
			false,
		},
		{
			"YAML",
			FormatYAML,
			map[string]interface{}{"key": "value"},
			&EncoderOptions{InsertSpaces: true, IndentSize: 2},
			"key: value\n",
			false,
		},
		{
			"TOML",
			FormatTOML,
			map[string]interface{}{"key": "value"},
			&EncoderOptions{InsertSpaces: true, IndentSize: 2},
			"key = \"value\"\n",
			false,
		},
		{
			"Unsupported",
			"unsupported",
			map[string]interface{}{"key": "value"},
			nil,
			"",
			true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var buf bytes.Buffer
			e := NewEncoder(&buf, tt.format, tt.options)
			err := e.Encode(tt.data)
			if tt.wantErr {
				require.Error(t, err)
			} else {
				require.NoError(t, err)
				assert.Equal(t, tt.want, buf.String())
			}
		})
	}
}
