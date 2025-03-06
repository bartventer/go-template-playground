// Package util provides zero-dependency utility types.
package util

// JSValuer describes an interface for types that can represent a JavaScript value.
type JSValuer interface {
	Truthy() bool
	Get(string) JSValuer
	Int() int
}
