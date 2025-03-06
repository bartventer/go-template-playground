//go:build js && wasm
// +build js,wasm

package playground

import (
	"syscall/js"
	"testing"
	"time"

	"github.com/bartventer/go-template-playground/internal/testutil"
	"github.com/stretchr/testify/assert"
)

func TestInitModule(t *testing.T) {
	go InitModule()

	for _, name := range []string{FuncNameTransformData, FuncNameProcessTemplate} {
		testutil.WaitForGlobalFunc(t, name,
			testutil.WithTimeout(5*time.Second),
			testutil.WithAssertion(func(v js.Value) assert.ValueAssertionFunc {
				return func(tt assert.TestingT, i1 interface{}, i2 ...interface{}) bool {
					return assert.Equal(tt, js.TypeFunction.String(), v.Type().String())
				}
			}),
		)
	}
}
