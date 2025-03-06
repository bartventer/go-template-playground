import type { Getter, Setter } from "jotai";

export type Callback<Value> = (
	get: Getter,
	set: Setter,
	data: {
		prevValue: Value;
		nextValue: Value;
	},
) => void;
