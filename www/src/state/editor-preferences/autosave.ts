import { atomWithEditorPreference } from "@atoms";
import {
	textModelDataFile,
	textModelTemplateFile,
} from "@components/editor/data";
import { IndexedDBService } from "@services/storage";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomEffect } from "jotai-effect";
import { editor, Uri } from "monaco-editor/esm/vs/editor/editor.api";
import { monacoReadyAtom } from "../editor-readiness";

export const autoSaveAtom = atomWithEditorPreference("autoSave");
export const autoSaveToggleAtom = atom(null, (get, set) => {
	set(autoSaveAtom, (prev) => !prev);
	const db = new IndexedDBService();
	if (!get(autoSaveAtom)) {
		console.debug("Clearing autosave data...");
		db.clear()
			.then(() => void console.debug("Autosave data cleared."))
			.catch(
				(e) => void console.error("Error clearing autosave data", e),
			);
	} else {
		const templateModel = editor.getModel(
			Uri.parse(textModelTemplateFile.path),
		);
		const contextModel = editor.getModel(Uri.parse(textModelDataFile.path));
		if (!templateModel || !contextModel) return;
		Promise.all(
			[templateModel, contextModel].map(async (model) => {
				try {
					return await db.put(model.uri.toString(), {
						languageId: model.getLanguageId(),
						value: model.getValue(),
					} as Playground.editor.AutoSavePayload);
				} catch (e) {
					console.error("Error committing autosave data", e);
				}
			}),
		)
			.then(() => void console.debug("Autosave data committed."))
			.catch(
				(e) => void console.error("Error committing autosave data", e),
			);
	}
});

export const useEditorAutoSavePreferenceAtom = () => useAtom(autoSaveAtom);
export const useEditorAutoSavePreferenceAtomValue = () =>
	useAtomValue(autoSaveAtom);
export const useToggleEditorAutoSavePreferenceAtom = () =>
	useSetAtom(autoSaveToggleAtom);
const dataRestoredAtom = atom<boolean>(false);
const dataRestoreEffect = atomEffect((get, set) => {
	if (!get(monacoReadyAtom)) return;
	if (get.peek(autoSaveAtom)) {
		const restore = async () => {
			const db = new IndexedDBService();
			for (const key of await db.getAllKeys()) {
				const payload = await db.get(key);
				if (!payload) continue;
				// Restore the payload
				const model = editor.getModel(Uri.parse(key));
				if (model) {
					model.setValue(payload.value);
				}
			}
		};
		restore();
	} else {
		const setDefault = () => {
			for (const file of [textModelTemplateFile, textModelDataFile]) {
				const model = editor.getModel(Uri.parse(file.path));
				if (model) {
					model.setValue(file.defaultValue);
				}
			}
		};
		setDefault();
	}
	set(dataRestoredAtom, true);

	return () => {
		set(dataRestoredAtom, false);
	};
});

export const useEditorDataRestoreEffect = () => useAtom(dataRestoreEffect);

export const useEditorDataRestoredAtomValue = () =>
	useAtomValue(dataRestoredAtom);
