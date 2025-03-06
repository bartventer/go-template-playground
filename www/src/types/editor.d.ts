// Type definitions for the playground editor
// Project: go-template-playground
// Definitions by: Bart Venter <bartventer@outlook.com>

import type { TextModelFile, TextModelPath } from "@components/editor/data";
import type * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import type { editor as monacoEditor } from "monaco-editor/esm/vs/editor/editor.api";
import type { Value } from "vfile";

declare global {
	namespace Playground {
		/** Provides types for interacting with the playground editor. */
		namespace editor {
			/** Monaco editor module. */
			type Monaco = typeof monaco;

			type VariantTemplate = "template";
			type VariantContext = "context";
			type VariantOutput = "output";
			type Variant = VariantTemplate | VariantContext | VariantOutput;

			type PropsWithCodeEditor<T = unknown> = T & {
				/** The editor instance. */
				instance: React.RefObject<
					| monacoEditor.IStandaloneCodeEditor
					| monacoEditor.ICodeEditor
				>[`current`];
			};

			type PropsWithModelPath<T = unknown> = T & {
				path: TextModelPath;
			};

			type OnReset = () => void;

			/**
			 * TransformEvent describes a function that can transform the data in the
			 * editor.
			 */
			type TransformEvent = (props: {
				/** The data to format. */
				data: string;
				/** The current format of the data. */
				currentFormat: Playground.CodeDataLanguage;
				/** The format to convert the data to. */
				nextFormat?: Playground.CodeDataLanguage;
				/** The options for encoding the data. */
				options?: Playground.EncoderOptions;
			}) => void;

			/**
			 * AutoSaveEventPayload describes the payload that is saved when the
			 * editor is autosaved.
			 */
			interface AutoSavePayload {
				value: string;
				/** The format of the value. Note: Output languages are not supported. */
				languageId:
					| Playground.CodeDataLanguage
					| Playground.CodeTemplateLanguage;
			}

			/** AutoSaveKey describes the key to save the autosave entry under. */
			type AutoSaveKey = string;

			/**
			 * AutoSaver describes the interface for saving autosave entries
			 * to storage.
			 */
			interface AutoSaver {
				put: (key: AutoSaveKey, data: AutoSavePayload) => Promise<void>;
				get: (key: AutoSaveKey) => Promise<AutoSavePayload | null>;
				getAllKeys: () => Promise<AutoSaveKey[]>;
				clear: () => Promise<void>;
			}

			interface AutosaveWorkerMessage extends AutoSavePayload {
				/** The key to save the value under. */
				key: AutoSaveKey;
			}

			interface MarkdownTransformerRequest {
				payload: Uint8Array;
			}

			interface MarkdownTransformerResult {
				action: "processed";
				value: Uint8Array;
			}

			interface MarkdownTransformerError {
				action: "error";
				value: Error;
			}

			interface MarkdownTransformerReady {
				action: "ready";
			}

			type MarkdownTransformerResponse =
				| MarkdownTransformerResult
				| MarkdownTransformerError
				| MarkdownTransformerReady;
		}
	}
}
