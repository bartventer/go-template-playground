import {
	ControlSource,
	EditorAction,
	EditorContextKey,
} from "@components/editor/constants";
import {
	textModelDataFile,
	textModelOutputFile,
	textModelTemplateFile,
} from "@components/editor/data";
import {
	codeEditorDataLanguages,
	codeEditorTemplateLanguages,
	CodeLanguages,
} from "@lib/monaco-editor/languages";
import type { Monaco } from "@monaco-editor/react";
import {
	useEditorDataRestoredAtomValue,
	useMonacoReadyAtomValue,
	useWasmReadyAtom,
} from "@state";
import { useDisposableRef } from "@utils/hooks";
import PlaygroundWorker from "@workers/playground.worker?worker";
import {
	editor,
	KeyCode,
	KeyMod,
	languages,
	Uri,
} from "monaco-editor/esm/vs/editor/editor.api";
import { startTransition, useCallback, useEffect, useRef } from "react";
import {
	isCodeDataLanguage,
	isCodeTemplateLanguage,
	replaceModelText,
} from "../utils";
import { createEncoderOptions } from "./utils";

interface UseProcessWasmProps {
	encoder: React.MutableRefObject<TextEncoder>;
	decoder: React.MutableRefObject<TextDecoder>;
}

interface UseProcessWasmReturn {
	/** Callback to process the template */
	handleProcessTemplate: (monaco?: Monaco) => void;
	/** Callback to format the data */
	handleTransformData: Playground.editor.TransformEvent;
}

/**
 * Custom hook to handle WebAssembly (Wasm) processing for templates and data formatting.
 *
 * @param {UseProcessWasmProps} props - The properties required for the Wasm processor, including encoder and decoder.
 * @returns {UseProcessWasmReturn} The callback functions to process the template and format the data.
 *
 * @remarks
 * This hook sets up a WebAssembly worker to handle template processing and data transformation.
 * It initializes the worker when the Monaco editor is ready and sets up message handlers for the worker.
 * It also configures editor actions for formatting and resetting data and template languages.
 *
 * @example
 * ```typescript
 * const { handleProcessTemplate, handleFormatData } = useProcessWasm({ encoder, decoder });
 * ```
 */
export function useProcessWasm({
	encoder,
	decoder,
}: UseProcessWasmProps): UseProcessWasmReturn {
	const isMonacoReady = useMonacoReadyAtomValue();
	const isDataRestored = useEditorDataRestoredAtomValue();
	const [isWasmReady, setWasmReady] = useWasmReadyAtom();
	const wasmWorkerRef = useRef<Worker | null>(null);
	const registerDocumentFormattingEditProviderRef = useDisposableRef();
	const addTemplateEditorActionRef = useDisposableRef();
	const addDataEditorActionRef = useDisposableRef();

	const handleProcessTemplate: UseProcessWasmReturn["handleProcessTemplate"] =
		useCallback((monaco) => {
			// Data model
			const dataModel = (monaco?.editor || editor).getModel(
				Uri.parse(textModelDataFile.path),
			);
			if (!dataModel) return;
			const dataView = encoder.current.encode(dataModel.getValue());

			// Template model
			const templateView = encoder.current.encode(
				(monaco?.editor || editor)
					.getModel(Uri.parse(textModelTemplateFile.path))
					?.getValue(),
			);
			wasmWorkerRef.current?.postMessage(
				{
					action: "processTemplate",
					payload: [
						templateView,
						dataView,
						dataModel.getLanguageId() as Playground.CodeDataLanguage,
					],
				} satisfies Playground.ProcessTemplateRequest,
				[templateView.buffer, dataView.buffer],
			);
		}, []);

	const handleTransformData: UseProcessWasmReturn["handleTransformData"] =
		useCallback(({ data, currentFormat, nextFormat, options }) => {
			const dataView = encoder.current.encode(data);
			wasmWorkerRef.current?.postMessage(
				{
					action: "transformData",
					payload: [dataView, currentFormat, nextFormat, options],
				} satisfies Playground.TransformDataRequest,
				[dataView.buffer],
			);
		}, []);

	// Effect to initialize the wasm worker
	useEffect(() => {
		if (isDataRestored) {
			wasmWorkerRef.current = new PlaygroundWorker();
			const wasmWorker = wasmWorkerRef.current;

			wasmWorker.onerror = (error) => {
				throw new Error(
					`Unexpected error while processing request: ${error.message}`,
				);
			};

			wasmWorker.onmessage = (event: MessageEvent<Playground.Result>) => {
				const { data } = event;
				const { action } = data;

				if (action === "wasmReady") {
					startTransition(() => setWasmReady(true));
					return;
				}

				const updateModelText = (path: string, value: string) => {
					const model = editor.getModel(Uri.parse(path));
					if (!model) {
						console.warn(`Model not found: ${path}`);
						return;
					}
					replaceModelText(model, value);
				};

				if ("error" in data) {
					updateModelText(textModelOutputFile.path, data.error);
					return;
				}

				const result = decoder.current.decode(data.data);
				switch (action) {
					case "processTemplate":
						updateModelText(textModelOutputFile.path, result);
						break;
					case "transformData":
						updateModelText(textModelDataFile.path, result);
						break;
					default:
						console.warn(`Unsupported action: ${action}`);
						break;
				}
			};
		}

		return () => {
			wasmWorkerRef.current?.terminate();
			wasmWorkerRef.current = null;
		};
	}, [isDataRestored, setWasmReady]);

	// Effect to configure the editor actions for data and template languages
	useEffect(() => {
		if (!isMonacoReady) return;

		type ConfigureCodeLanguage<L extends Playground.CodeLanguage> = (
			languageId: L,
			props?: {
				skipFormatting?: boolean;
				skipReset?: boolean;
			},
		) => void;

		const configureDataLanguage: ConfigureCodeLanguage<
			Playground.CodeDataLanguage
		> = (languageId, { skipFormatting, skipReset } = {}) => {
			if (!skipFormatting) {
				registerDocumentFormattingEditProviderRef.current =
					languages.registerDocumentFormattingEditProvider(
						languageId,
						{
							provideDocumentFormattingEdits: (model) => {
								handleTransformData({
									data: model.getValue(),
									currentFormat: languageId,
									nextFormat: languageId,
									options: createEncoderOptions(
										model.getOptions(),
									),
								});
								return [];
							},
							displayName:
								codeEditorDataLanguages[languageId].label,
						},
					);
			}

			if (!skipReset) {
				addDataEditorActionRef.current = editor.addEditorAction({
					...resetActionDefaults,
					id: `reset-${languageId}`,
					label: `Reset ${codeEditorDataLanguages[languageId].label}`,
					precondition: `${EditorContextKey.EditorLanguageId} == '${languageId}'`,
					run: (codeEditor) => {
						handleTransformData({
							data: textModelDataFile.defaultValue,
							currentFormat: textModelDataFile.defaultLanguage.id,
							nextFormat: languageId,
							options: createEncoderOptions(
								codeEditor.getModel()?.getOptions(),
							),
						});

						setTimeout(() => {
							codeEditor.focus();
							codeEditor.trigger(
								ControlSource.Keyboard,
								EditorAction.FormatDocument,
								{},
							);
						}, 50);
					},
				});
			}
		};

		const configureTemplateLanguage: ConfigureCodeLanguage<
			Playground.CodeTemplateLanguage
		> = (languageId, { skipReset } = {}) => {
			if (!skipReset) {
				addTemplateEditorActionRef.current = editor.addEditorAction({
					...resetActionDefaults,
					id: "reset-template",
					label: "Reset Template",
					precondition: `${EditorContextKey.EditorLanguageId} == '${languageId}'`,
					run: (codeEditor) => {
						const model = codeEditor.getModel();
						replaceModelText(
							model,
							textModelTemplateFile.defaultValue,
						);
					},
				});
			}
		};

		const configureLanguage = (language: string) => {
			if (isCodeDataLanguage(language)) {
				configureDataLanguage(language, {
					skipFormatting: language === CodeLanguages.JSON, // JSON has built-in formatting
				});
			} else if (isCodeTemplateLanguage(language)) {
				configureTemplateLanguage(language);
			} else {
				console.warn(`Unsupported language: ${language}`);
			}
		};

		Object.keys({
			...codeEditorDataLanguages,
			...codeEditorTemplateLanguages,
		}).forEach(configureLanguage);

		return () => {
			registerDocumentFormattingEditProviderRef.current?.dispose();
			addDataEditorActionRef.current?.dispose();
			addTemplateEditorActionRef.current?.dispose();
		};
	}, [isMonacoReady, handleTransformData]);

	// Generate the initial output
	useEffect(() => {
		if (isWasmReady && isDataRestored) {
			handleProcessTemplate();
		}
	}, [isWasmReady, isDataRestored, handleProcessTemplate]);

	return {
		handleProcessTemplate,
		handleTransformData,
	};
}

const resetActionDefaults = {
	contextMenuGroupId: "1_modification",
	contextMenuOrder: 3,
	keybindings: [KeyMod.CtrlCmd | KeyCode.KeyR],
} as const satisfies Partial<editor.IActionDescriptor>;
