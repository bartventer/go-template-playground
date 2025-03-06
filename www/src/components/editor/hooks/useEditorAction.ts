import type { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { useCallback } from "react";
import { type EditorAction, ControlSource } from "../constants";

type UseEditorActionParams = [
	instance: editor.IStandaloneCodeEditor | null,
	action: EditorAction,
	options?: {
		source?: ControlSource;
		/**
		 * The payload to pass to the action handler.
		 * @see {@link editor.IEditor.trigger}
		 */
		payload?: any;
	},
];
type UseEditorActionReturn = () => void;

export function useEditorAction(
	...[instance, action, options]: UseEditorActionParams
): UseEditorActionReturn {
	return useCallback(() => {
		instance?.trigger(
			options?.source ?? ControlSource.None,
			action,
			options?.payload,
		);
	}, [action, instance, options]);
}
