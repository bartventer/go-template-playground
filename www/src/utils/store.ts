/**
 * @fileoverview
 * This module provides a way to create a simple store for managing state.
 */

import { get, set, unset } from "lodash";
import { useSyncExternalStore } from "react";

/**
 * Represents a simple generic store for managing state.
 *
 * @template T - The type of the state object.
 */
export type Store<T extends object> = {
	/**
	 * Sets the value at the specified path in the state.
	 *
	 * @template K - The key of the state object.
	 * @param {K} path - The path to the value in the state.
	 * @param {T[K]} value - The value to set at the specified path.
	 */
	setValue: <K extends keyof T>(path: K, value: T[K]) => void;

	/**
	 * Gets the value at the specified path in the state.
	 *
	 * @template K - The key of the state object.
	 * @param {K} path - The path to the value in the state.
	 * @returns {T[K]} The value at the specified path.
	 *
	 * @remarks
	 * Does not trigger a re-render when the value changes.
	 * Ideal for getting values in the initial render or outside of React components.
	 */
	getValue: <K extends keyof T>(path: K) => T[K];

	/**
	 * Uses the value at the specified path in the state, returning a default value if the path does not exist.
	 *
	 * @template K - The key of the state object.
	 * @param {K} path - The path to the value in the state.
	 * @param {T[K]} defaultValue - The default value to return if the path does not exist.
	 * @returns {T[K]} The value at the specified path or the default value.
	 *
	 * @remarks
	 * Triggers a re-render when the value changes.
	 * Ideal for using values in React components.
	 */
	useValue: <K extends keyof T>(path: K, defaultValue: T[K]) => T[K];
};

/**
 * Creates a simple store with an initial value and provides methods to interact with it.
 *
 * @template State - The type of the initial value object.
 * @param {State} [initialValue={}] - The initial value of the store.
 * @returns {Store<State>} The store object with methods to set, get, and use values.
 *
 * @example
 * const store = createStore({ count: 0 });
 * store.setValue("count", 1);
 * const count = store.getValue("count");
 * const count = store.useValue("count", 0);
 */
export function createStore<State extends object>(
	initialValue: State = {} as State,
): Store<State> {
	const data = initialValue;
	const registry = new Set<(data: State) => void>();

	function subscribe(listener: (data: State) => void) {
		registry.add(listener);
		return () => {
			registry.delete(listener);
		};
	}

	function setValue<K extends keyof State>(path: K, value: State[K]) {
		if (value === undefined) {
			unset(data, path);
		} else {
			set(data, path, value);
		}
		registry.forEach((listener) => listener(data));
	}

	function getValue<K extends keyof State>(path: K) {
		return get(data, path);
	}

	function useValue<K extends keyof State>(path: K, defaultValue: State[K]) {
		const value = useSyncExternalStore(
			subscribe,
			() => getValue(path) || defaultValue,
		);
		return value;
	}

	return { setValue, getValue, useValue };
}

type ToHookName<S extends string> = `use${Capitalize<string & S>}`;
type UnHookName<S extends string> = S extends `use${infer Rest}`
	? Uncapitalize<Rest>
	: S;
type ValueGetter<Value> = () => Value;
type ValueSetter<Value> = (value: Value) => void;
type StoreApiAccessors<StateType> = {
	[K in keyof StateType as ToHookName<string & K>]: ValueGetter<StateType[K]>;
};
type StoreApiSetters<StateType> = {
	[K in keyof StateType as ToHookName<`set${Capitalize<string & K>}`>]: () => ValueSetter<
		StateType[K]
	>;
};
export type StoreApi<StateType> = StoreApiAccessors<StateType> &
	StoreApiSetters<StateType>;
export type ExtractApiState<ApiType> = {
	[K in keyof ApiType as UnHookName<K & string>]: ApiType[K] extends (
		...args: any[]
	) => any
		? ReturnType<ApiType[K]>
		: never;
};
