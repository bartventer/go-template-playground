import { ControlSource, EditorAction } from "@components/editor/constants";
import type { TextModelPath } from "@components/editor/data";
import { textModelPreferencesDefaults } from "@state/data";
import { type TextModelPreferences } from "@state/types";
import { debugAtoms, privatizeAtoms } from "@utils/atoms";
import type { Atom, PrimitiveAtom, SetStateAction } from "jotai";
import { atom, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { useEffect } from "react";
import type { Callback } from "./types";

/**
 * Represents the state of text model preferences where each key in `TextModelPreferences`
 * is mapped to a `PrimitiveAtom` of the corresponding value type.
 *
 * @template K - The keys of `TextModelPreferences`.
 */
export type TextModelPreferencesState = {
	[K in keyof TextModelPreferences]-?: PrimitiveAtom<TextModelPreferences[K]>;
};

type OnModelCreatedHandler<
	T extends TextModelPreferences[keyof TextModelPreferences],
> = (model: editor.ITextModel) => Callback<T>;

function atomWithTextModelPreference<Key extends keyof TextModelPreferences>(
	path: TextModelPath,
	key: Key,
) {
	const defaults = textModelPreferencesDefaults.get(path);
	if (!defaults) {
		throw new Error(`No default values found for path ${path}`);
	}
	type Value = TextModelPreferences[Key];
	const baseAtom = atomWithStorage<Value>(
		`model-preferences:${path}:${key}`,
		defaults[key],
		undefined, // Defaults to localStorage
		{ getOnInit: true }, // Read from storage on initialization
	);

	const listenersAtom = atom<Callback<Value>[]>([]);

	const derivedAtom = atom(
		(get) => get(baseAtom),
		(get, set, arg: SetStateAction<Value>) => {
			const prevValue = get(baseAtom);
			set(baseAtom, arg);
			const nextValue = get(baseAtom);
			const listeners = get(listenersAtom);
			for (let i = 0; i < listeners.length; i++) {
				listeners[i](get, set, { prevValue, nextValue });
			}
		},
	);

	type UseListenerProps = {
		/**
		 * A callback function that is called when the model is created.
		 * This function can be used to set up listeners for the model.
		 */
		onModelCreateFn?: OnModelCreatedHandler<Value>;
		/**
		 * Whether to skip auto-formatting the document after updating the preference.
		 * Defaults to `false`.
		 */
		skipAutoFormat?: boolean;
	};

	/**
	 * Custom hook that sets up a listener for the creation of text models in the editor.
	 * It uses exponential backoff to handle cases where the editor is not yet ready.
	 *
	 * @example
	 * useListener({
	 *   onModelCreateFn: (model) => {
	 *     // Custom logic for model creation
	 *   },
	 *   skipAutoFormat: true,
	 * });
	 */
	function useListener({
		onModelCreateFn,
		skipAutoFormat,
	}: UseListenerProps = {}) {
		const setListeners = useSetAtom(listenersAtom);

		useEffect(() => {
			let callback: ReturnType<OnModelCreatedHandler<Value>> | undefined;
			const listener: Parameters<typeof editor.onDidCreateModel>[0] = (
				model,
			) => {
				const uri = model.uri.toString();
				if (!uri) {
					throw new Error(
						`Text model is not defined for path ${path}`,
					);
				}
				if (uri !== path) {
					return;
				}

				if (!onModelCreateFn) {
					callback = (_get, _set, { nextValue }) => {
						model.updateOptions({
							[key]: nextValue,
						});

						if (!skipAutoFormat) {
							const codeEditor = editor.getEditors().find((e) => {
								return e.getModel()?.uri.toString() === uri;
							});
							codeEditor?.trigger(
								ControlSource.None,
								EditorAction.FormatDocument,
								{},
							);
						}
					};
				} else {
					callback = onModelCreateFn(model);
				}
				setListeners((prev) => {
					if (!callback) return prev;
					return [...prev, callback];
				});
			};
			const subscriber = editor.onDidCreateModel(listener);

			return () => {
				subscriber.dispose();
				setListeners((prev) => {
					if (!callback) return prev;
					const index = prev.indexOf(callback);
					return [...prev.slice(0, index), ...prev.slice(index + 1)];
				});
			};
		}, [onModelCreateFn, setListeners]);
	}

	privatizeAtoms(derivedAtom);
	debugAtoms(
		[baseAtom, `model-preferences:${new URL(path).pathname}:${key}`],
		[
			listenersAtom,
			`model-preferences:${new URL(path).pathname}:${key}:listeners`,
		],
	);
	return [derivedAtom, useListener] as const;
}

type AtomWithTextModelPreferences = (
	path: TextModelPath,
) => [
	readonlyAtom: Atom<TextModelPreferencesState>,
	usePreferencesListener: () => void,
];

/**
 * Creates an atom with text model preferences for a given path.
 *
 * This function sets up atoms for various editor preferences such as
 * `trimAutoWhitespace`, `insertSpaces`, `tabSize`, and `indentSize`.
 * It also provides a custom hook to set up listeners for these preferences.
 *
 * @param path - The path for which the text model preferences are being set.
 * @returns A tuple containing a readonly atom with the preferences and a custom hook to set up listeners.
 */
export const atomWithTextModelPreferences: AtomWithTextModelPreferences = (
	path,
) => {
	const [trimAutoWhitespaceAtom, useTrimAutoWhitespaceListener] =
		atomWithTextModelPreference(path, "trimAutoWhitespace");
	const [insertSpacesAtom, useInsertSpacesListener] =
		atomWithTextModelPreference(path, "insertSpaces");
	const [tabSizeAtom, useTabSizeListener] = atomWithTextModelPreference(
		path,
		"tabSize",
	);
	const [indentSizeAtom, useIndentSizeListener] = atomWithTextModelPreference(
		path,
		"indentSize",
	);

	const baseAtom = atom({
		trimAutoWhitespace: trimAutoWhitespaceAtom,
		insertSpaces: insertSpacesAtom,
		tabSize: tabSizeAtom,
		indentSize: indentSizeAtom,
	});
	const readonlyAtom = atom((get) => get(baseAtom));
	privatizeAtoms(baseAtom, readonlyAtom);

	/**
	 * Custom hook that sets up listeners for various text model preferences.
	 */
	const usePreferencesListener = () => {
		useTrimAutoWhitespaceListener();
		useInsertSpacesListener();
		useTabSizeListener();
		useIndentSizeListener();
	};

	return [readonlyAtom, usePreferencesListener] as const;
};
