import { editorPreferencesDefaults } from "@state/data";
import type {
	CustomEditorPreferences,
	EditorPreferences,
	NativeEditorPreferences,
} from "@state/types";
import { debugAtoms, privatizeAtoms } from "@utils/atoms";
import {
	atom,
	useSetAtom,
	type SetStateAction,
	type WritableAtom,
} from "jotai";
import { atomWithStorage } from "jotai/utils";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { useEffect } from "react";
import type { Callback } from "./types";

type OnDidCreateEditorCallback<
	Value extends NativeEditorPreferences[keyof NativeEditorPreferences],
> = (codeEditor: editor.ICodeEditor) => Callback<Value>;

/**
 * NOTE: Native editor preferences are those that are directly supported by the Monaco editor.
 */

/**
 * Creates an atom for an editor preference.
 */
export function atomWithEditorPreference<Key extends keyof EditorPreferences>(
	key: Key,
	initialValue: NoInfer<EditorPreferences[Key]> = editorPreferencesDefaults[
		key
	],
	storage?: Parameters<typeof atomWithStorage<EditorPreferences[Key]>>[2],
) {
	const baseAtom = atomWithStorage<EditorPreferences[Key]>(
		`editor-preferences:${key}`,
		initialValue,
		storage,
		{
			getOnInit: true,
		},
	);
	debugAtoms([baseAtom, `editor-preferences:${key}`]);
	return baseAtom;
}

/**
 * Creates an atom with editor native preference and a listener hook.
 *
 * This function creates an atom that syncs with editor preferences and provides a hook
 * to listen for changes in the editor's creation. The listener hook allows you to register
 * callbacks that will be invoked whenever a new editor is created, and these callbacks can
 * react to changes in the atom's state.
 */
export function atomWithNativeEditorPreferenceAndListener<
	Key extends keyof NativeEditorPreferences,
>(key: Key) {
	const baseAtom = atomWithEditorPreference(key);
	type Value = EditorPreferences[Key];
	const derivedAtom = atom(
		(get) => get(baseAtom),
		(get, set, arg: SetStateAction<Value>) => {
			const prevValue = get(baseAtom);
			set(baseAtom, arg);
			const nextValue = get(baseAtom);
			get(listenersAtom).forEach((callback) => {
				callback(get, set, { prevValue, nextValue });
			});
		},
	);

	const listenersAtom = atom<Callback<Value>[]>([]);

	function useListener(
		onEditorCreatedFn: OnDidCreateEditorCallback<Value>,
	): void;
	function useListener(): void;
	function useListener(
		onEditorCreatedFn?: OnDidCreateEditorCallback<Value>,
	): void {
		const setListeners = useSetAtom(listenersAtom);
		useEffect(() => {
			let callback:
				| ReturnType<OnDidCreateEditorCallback<Value>>
				| undefined;
			const listener: Parameters<typeof editor.onDidCreateEditor>[0] = (
				codeEditor,
			) => {
				if (!onEditorCreatedFn) {
					callback = (_get, _set, { nextValue }) => {
						codeEditor.updateOptions({
							[key]: nextValue,
						});
					};
				} else {
					callback = onEditorCreatedFn(codeEditor);
				}

				setListeners((prev) => {
					if (!callback) return prev;
					return [...prev, callback];
				});
			};
			const subscriber = editor.onDidCreateEditor(listener);
			return () => {
				subscriber.dispose();
				setListeners((prev) => {
					if (!callback) return prev;
					const index = prev.indexOf(callback);
					return [...prev.slice(0, index), ...prev.slice(index + 1)];
				});
			};
		}, [onEditorCreatedFn, setListeners]);
	}

	privatizeAtoms(baseAtom, listenersAtom);
	debugAtoms([derivedAtom, `editor-preferences:${key}`]);
	return [derivedAtom, useListener] as const;
}

/**
 * Creates an atom with a editor native preference and a toggle function.
 *
 * This function generates an atom that reflects a editor native preference
 * and provides a way to toggle its boolean value. It also sets up a listener for
 * changes to the preference.
 */
export function atomWithToggleableNativeEditorPreferenceAndListener<
	K extends Playground.types.BooleanKeys<NativeEditorPreferences>,
>(key: K) {
	const [baseAtom, useListener] =
		atomWithNativeEditorPreferenceAndListener(key);
	const derivedAtom = atom(
		(get) => get(baseAtom),
		(_get, set) => {
			set(baseAtom, (prev) => !prev);
		},
	);
	privatizeAtoms(baseAtom);
	return [derivedAtom, useListener] as const;
}

/**
 * Creates a writable atom that toggles a custom editor preference.
 */
export function atomWithToggleableCustomEditorPreference<
	K extends Playground.types.BooleanKeys<CustomEditorPreferences>,
>(key: K) {
	const anAtom = atomWithEditorPreference(key);
	const derivedAtom = atom(
		(get) => get(anAtom),
		(get, set) => {
			const current = get(anAtom);
			void set(anAtom, !current);
		},
	);
	privatizeAtoms(anAtom);
	return derivedAtom as WritableAtom<boolean, [], void>;
}
