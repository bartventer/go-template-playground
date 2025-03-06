import type { EditorProviderProps } from "@components/editor/editor-provider/EditorProvider";
import {
	textModelDataFile,
	textModelTemplateFile,
} from "@components/editor/data";
import {
	autoSaveAtom,
	useEditorDataRestoreEffect,
	useMonacoReadyAtomValue,
} from "@state";
import AutoSaveWorker from "@workers/autosave.worker?worker";
import { useAtomCallback } from "jotai/utils";
import { useCallback, useEffect, useRef } from "react";

interface UseEditorAutosaveReturn {
	/**
	 * Callback to handle autosave events.
	 *
	 * NOTE: If autosave is not enabled, this callback will not do anything.
	 */
	handleAutosave: Required<EditorProviderProps>["onChangeModelContent"];
}

export function useEditorAutosave(): UseEditorAutosaveReturn {
	const isMonacoReady = useMonacoReadyAtomValue();
	const autosaveWorkerRef = useRef<Worker | null>(null);
	useEditorDataRestoreEffect();

	useEffect(() => {
		if (isMonacoReady) {
			autosaveWorkerRef.current = new AutoSaveWorker();
			const autosaveWorker = autosaveWorkerRef.current;
			autosaveWorker.onerror = (error) => {
				throw new Error(
					`Unexpected error while processing request: ${error.message}`,
				);
			};
		}

		return () => {
			autosaveWorkerRef.current?.terminate();
			autosaveWorkerRef.current = null;
		};
	}, [isMonacoReady]);

	const handleAutosave: UseEditorAutosaveReturn["handleAutosave"] =
		useAtomCallback(
			useCallback((get, _set, ...[_event, codeEditor, _monaco]) => {
				if (!get(autoSaveAtom)) return;
				const model = codeEditor.getModel();
				if (!model) return;
				const uri = model.uri.toString();
				switch (uri) {
					case textModelTemplateFile.path:
					case textModelDataFile.path:
						autosaveWorkerRef.current?.postMessage({
							key: uri,
							value: model.getValue(),
							languageId: model.getLanguageId(),
						} as Playground.editor.AutosaveWorkerMessage);
						break;
					default:
						break;
				}
			}, []),
		);

	return {
		handleAutosave,
	};
}
