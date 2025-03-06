import { useMonacoReadyAtomValue } from "@state";
import { useEffect } from "react";
import { useEditorApi } from "../editor-provider";
import { textModelTemplateFile } from "../data";

const FOCUS_DELAY_MS = 100;

/**
 * Custom hook that sets up an effect to autofocus the editor instance after a delay.
 */
export function useEditorAutofocusEffect(): void {
	const isMonacoReady = useMonacoReadyAtomValue();
	const editorApi = useEditorApi();
	const instance = editorApi.useInstance();
	useEffect(() => {
		if (
			isMonacoReady &&
			instance?.getModel()?.uri.toString() === textModelTemplateFile.path
		) {
			const timeoutId = setTimeout(
				() => instance.focus(),
				FOCUS_DELAY_MS,
			);
			return () => clearTimeout(timeoutId);
		}
	}, [isMonacoReady, instance]);

	useEffect(() => {
		const listener = instance?.onDidChangeModel(() => {
			const timeoutId = setTimeout(
				() => instance.focus(),
				FOCUS_DELAY_MS,
			);
			return () => clearTimeout(timeoutId);
		});
		return () => listener?.dispose();
	}, [instance]);

	return;
}
