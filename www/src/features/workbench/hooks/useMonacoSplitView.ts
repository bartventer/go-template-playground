import { ControlSource, EditorAction } from "@components/editor/constants";
import {
	TOTAL_TEXT_MODEL_FILES,
	type TextModelFile,
	textModelDataFile,
	textModelFilesByUri,
	textModelOutputFile,
	textModelTemplateFile,
} from "@components/editor/data";
import type { EditorProviderProps } from "@components/editor/editor-provider/EditorProvider";
import { CodeLanguages } from "@lib/monaco-editor/languages";
import {
	editorPreferencesAtom,
	modelsReadyAtom,
	textModelPreferencesAtom,
	useEditorFullScreenPreferenceAtomValue,
	useEditorsReadyAtom,
	wasmReadyAtom,
} from "@state";
import { useDisposableRef } from "@utils/hooks";
import { getDefaultStore } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import {
	startTransition,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from "react";
import { useEditorAutosave, useMarkdownTransform, useProcessWasm } from ".";
import { type LayoutVariant, layoutHiddenFilePaths } from "../constants";
import { getOrCreateModel } from "../utils";
import { createEncoderOptions } from "./utils";

const FORMAT_DOCUMENT_DELAY_MS = 50;

export interface UseMonacoSplitViewProps {
	variant: LayoutVariant;
}

interface UseMonacoSplitViewReturn
	extends Required<Playground.types.Omitted<EditorProviderProps, "files">> {
	fullscreen: boolean;
}

export function useMonacoSplitView({
	variant,
}: UseMonacoSplitViewProps): UseMonacoSplitViewReturn {
	const fullscreen = useEditorFullScreenPreferenceAtomValue();
	const defaultStore = useRef(getDefaultStore());
	const encoder = useRef(new TextEncoder());
	const decoder = useRef(new TextDecoder("utf-8"));
	const onDidCreateModelRef = useDisposableRef();

	const hiddenPaths = useMemo(
		() => layoutHiddenFilePaths[variant],
		[variant],
	);

	const totalVisibleEditors = useMemo(
		() => TOTAL_TEXT_MODEL_FILES - hiddenPaths.length,
		[hiddenPaths],
	);

	const [isEditorsReady, setEditorsReady] = useEditorsReadyAtom();

	const { handleTransformData, handleProcessTemplate } = useProcessWasm({
		encoder,
		decoder,
	});
	const { handleTransformMarkdown } = useMarkdownTransform({ encoder });
	const { handleAutosave } = useEditorAutosave();
	const formatDocument = useCallback(
		(codeEditor: editor.IStandaloneCodeEditor | editor.ICodeEditor) => {
			codeEditor.trigger(
				ControlSource.None,
				EditorAction.FormatDocument,
				{},
			);
		},
		[],
	);

	const handleChangeModelLanguage: Required<EditorProviderProps>["onChangeModelLanguage"] =
		useCallback(
			({ newLanguage, oldLanguage }, codeEditor, _monaco) => {
				const model = codeEditor.getModel();
				if (
					!model ||
					!([textModelDataFile.path] as string[]).includes(
						model.uri.toString(),
					)
				) {
					return;
				}
				handleTransformData({
					data: model.getValue(),
					currentFormat: oldLanguage as Playground.CodeDataLanguage,
					nextFormat: newLanguage as Playground.CodeDataLanguage,
					options: createEncoderOptions(
						newLanguage === CodeLanguages.JSON
							? undefined
							: model.getOptions(),
					),
				});
				setTimeout(() => {
					formatDocument(codeEditor);
				}, FORMAT_DOCUMENT_DELAY_MS);
			},
			[handleTransformData, formatDocument],
		);

	const handleChangeModelContent: Required<EditorProviderProps>["onChangeModelContent"] =
		useAtomCallback(
			useCallback(
				(get, _set, event, codeEditor, monaco) => {
					if (!get(wasmReadyAtom)) {
						return;
					}
					const model = codeEditor.getModel();
					switch (model?.uri.toString()) {
						case textModelTemplateFile.path:
						case textModelDataFile.path:
							handleProcessTemplate(monaco);
							handleAutosave(event, codeEditor, monaco);
							break;
						case textModelOutputFile.path:
							handleTransformMarkdown(monaco);
							break;
						default:
							break;
					}
				},
				[
					handleAutosave,
					handleProcessTemplate,
					handleTransformMarkdown,
				],
			),
		);

	const handleChangeModel: Required<EditorProviderProps>["onChangeModel"] =
		useCallback(
			(_event, codeEditor, _monaco) => {
				formatDocument(codeEditor);
			},
			[formatDocument],
		);

	const handleUpdateOptions: (
		codeEditor: editor.IStandaloneCodeEditor | editor.ICodeEditor,
	) => void = useAtomCallback(
		useCallback((get, _set, codeEditor) => {
			codeEditor.updateOptions(get(editorPreferencesAtom));
		}, []),
	);

	const handleMount: Required<EditorProviderProps>["onMount"] = useCallback(
		(codeEditor) => {
			startTransition(() => {
				handleUpdateOptions(codeEditor);
				if (totalVisibleEditors === editor.getModels().length) {
					startTransition(() => setEditorsReady(true));
				}
			});
		},
		[handleUpdateOptions, setEditorsReady, totalVisibleEditors],
	);

	// Effect to create hidden models
	useEffect(() => {
		if (isEditorsReady && !!hiddenPaths.length) {
			hiddenPaths.forEach(getOrCreateModel);
		}
	}, [isEditorsReady, hiddenPaths]);

	// Effect to update model options
	useEffect(() => {
		const store = defaultStore.current;
		onDidCreateModelRef.current = editor.onDidCreateModel((model) => {
			const uri = model.uri.toString() as TextModelFile["path"];
			if (!textModelFilesByUri.has(uri)) {
				return;
			}
			const preferences = store.get(textModelPreferencesAtom)[uri];
			model.updateOptions({
				tabSize: store.get(preferences.tabSize),
				insertSpaces: store.get(preferences.insertSpaces),
				trimAutoWhitespace: store.get(preferences.trimAutoWhitespace),
				indentSize: store.get(preferences.indentSize),
			});
			if (editor.getModels().length === TOTAL_TEXT_MODEL_FILES) {
				startTransition(() => store.set(modelsReadyAtom, true));
			}
		});

		return () => {
			onDidCreateModelRef.current?.dispose();
		};
	}, []);

	return {
		fullscreen,
		onChangeModelLanguage: handleChangeModelLanguage,
		onChangeModelContent: handleChangeModelContent,
		onChangeModel: handleChangeModel,
		onMount: handleMount,
	};
}
