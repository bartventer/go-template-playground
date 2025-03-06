// Type definitions for go-template-playground
// Project: go-template-playground
// Definitions by: Bart Venter <bartventer@outlook.com>

import type {
	CodeDataLanguage,
	CodeLanguage,
	CodeLanguageMetadata,
	CodeOutputLanguage,
	CodeTemplateLanguage,
} from "@lib/monaco-editor/languages";
import "./editor";

declare global {
	/**
	 * processTemplate is the function that processes a template with a context.
	 * @param templateView - The byte array containing the template data.
	 * @param dataView - The byte array containing the context data.
	 * @param format - The format of the context data.
	 * @returns The result of processing the template, or an error message string.
	 */
	function processTemplate(
		templateView: Uint8Array,
		dataView: Uint8Array,
		format: CodeDataLanguage,
	): Playground.ProcessTemplateResult;

	/**
	 * EncoderOptions represents options for encoding data.
	 */
	interface EncoderOptions {
		/** Whether to insert spaces in the output. If false, tabs are used. */
		insertSpaces?: boolean;
		/** The size of the indent. */
		indentSize?: number;
		/** Do not indent the output. */
		noIndent?: boolean;
	}

	/**
	 * transformData transforms data from one format to another.
	 * @param dataView - The byte array containing the data.
	 * @param prevFormat - The format of the data.
	 * @param nextFormat - Optional: The format to convert the data to, defaults to prevFormat.
	 * @param options - Optional: The options for encoding the data.
	 * @returns The transformed data, or an error message string.
	 */
	function transformData(
		dataView: Uint8Array,
		prevFormat: CodeDataLanguage,
		nextFormat?: CodeDataLanguage,
		options?: EncoderOptions,
	): Playground.TransformDataResult;
}

declare global {
	/** Provides utility types for interacting with the playground. */
	namespace Playground {
		export {
			CodeTemplateLanguage,
			CodeDataLanguage,
			CodeOutputLanguage,
			CodeLanguage,
			CodeLanguageMetadata,
			EncoderOptions,
		};

		type ProcessTemplateArgs = Parameters<typeof processTemplate>;

		export interface ProcessTemplateRequest {
			action: "processTemplate";
			payload: ProcessTemplateArgs;
		}

		type TransformDataArgs = Parameters<typeof transformData>;

		export interface TransformDataRequest {
			action: "transformData";
			payload: TransformDataArgs;
		}

		export type Request = ProcessTemplateRequest | TransformDataRequest;

		interface ProcessTemplateSuccess {
			action: "processTemplate";
			data: Uint8Array;
		}

		interface ProcessTemplateError {
			action: "processTemplate";
			error: string;
		}

		export interface WasmReadyResult {
			action: "wasmReady";
		}

		type ProcessTemplateResult =
			| ProcessTemplateSuccess
			| ProcessTemplateError;

		interface TransformDataSuccess {
			action: "transformData";
			data: Uint8Array;
		}

		interface TransformDataError {
			action: "transformData";
			error: string;
		}

		type TransformDataResult = TransformDataSuccess | TransformDataError;

		export type Result =
			| ProcessTemplateResult
			| TransformDataResult
			| WasmReadyResult;

		export type SuccessResult =
			| ProcessTemplateSuccess
			| TransformDataSuccess;

		export type ErrorResult = ProcessTemplateError | TransformDataError;
	}
}

declare global {
	namespace Playground {
		namespace components {
			/**
			 * LabeledOption
			 * @description Represents an option with a value and a label.
			 * @template Value - A string literal type representing the value of the option.
			 */
			interface LabeledOption<Value extends string> {
				value: Value;
				label: string;
			}
		}
	}
}

declare global {
	namespace Playground {
		/** Provides general purpose utility types. */
		namespace types {
			/**
			 * Omitted
			 * @description For `T` object, omit the specified keys `K`. This a typed version of `Omit`.
			 * @template T - The object type.
			 */
			type Omitted<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

			/**
			 * RequiredFor
			 * @description For `T` object, make the specified keys `K` required. This a typed version of `Required`.
			 * @template T - The object type.
			 */
			type RequiredFor<T, K extends keyof T> = Omitted<T, K> &
				Required<Pick<T, K>>;

			/**
			 * BooleanKeys
			 * @description Extracts keys of type `boolean` from an object.
			 * @template T - The object type to extract keys from.
			 */
			type BooleanKeys<T> = {
				[K in keyof T]: T[K] extends boolean ? K : never;
			}[keyof T];
		}
	}
}

declare global {
	interface PromiseConstructor {
		first<T>(promises: Promise<T>[]): Promise<T>;
	}
}
