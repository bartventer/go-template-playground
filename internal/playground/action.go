package playground

//go:generate go tool golang.org/x/tools/cmd/stringer -type=Action -trimprefix=Action

// Action represents an action to be performed by the playground.
type Action uint8

// Action constants.
const (
	ActionProcessTemplate Action = iota
	ActionTransformData
)
