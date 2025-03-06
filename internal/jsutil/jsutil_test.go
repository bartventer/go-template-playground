//go:build js && wasm
// +build js,wasm

package jsutil

import (
	"syscall/js"
	"testing"

	"github.com/bartventer/go-template-playground/internal/testutil"
	"github.com/stretchr/testify/assert"
)

func Test_getBufferLength(t *testing.T) {
	t.Run("Valid", func(t *testing.T) {
		buffer := unint8ArrayConstructor.New(10)
		length := getUint8ArrayLength(&buffer)
		assert.Equal(t, 10, length)
	})

	t.Run("Panic", func(t *testing.T) {
		assert.Panics(t, func() {
			getUint8ArrayLength(testutil.Ptr(js.ValueOf(10)))
		})
	})
}

func TestMakeUint8Array(t *testing.T) {
	bytes := []byte{1, 2, 3, 4, 5}
	buffer := MakeUint8Array(bytes)
	length := getUint8ArrayLength(&buffer)
	assert.Equal(t, len(bytes), length)

	for i, b := range bytes {
		assert.Equal(t, b, byte(buffer.Index(i).Int()))
	}
}

func TestCopyUint8Array(t *testing.T) {
	bytes := []byte{1, 2, 3, 4, 5}
	buffer := MakeUint8Array(bytes)
	copiedBytes, n := CopyUint8Array(&buffer)
	assert.Equal(t, len(bytes), n)
	assert.Equal(t, bytes, copiedBytes)
}
