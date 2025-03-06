import type classes from "@components/editor/MultifileEditor.css";
import type { IQuickPickItem } from "monaco-editor/esm/vs/platform/quickinput/common/quickInput";
import { GO_TEMPLATE_LANGUAGE_ALIASES } from "./go-template-language";
import { CodeLanguages } from "./supported-languages";
import { TOML_LANGUAGE_ALIASES } from "./toml-language";

export type CodeTemplateLanguage = typeof CodeLanguages.GoTemplate;

export type CodeOutputLanguage =
	| typeof CodeLanguages.Plaintext
	| typeof CodeLanguages.Markdown;

export type CodeDataLanguage = Exclude<
	(typeof CodeLanguages)[keyof typeof CodeLanguages],
	CodeTemplateLanguage | CodeOutputLanguage
>;

/** The kind of language supported in the Playground. */
export type CodeLanguage =
	| CodeTemplateLanguage
	| CodeDataLanguage
	| CodeOutputLanguage;

/** Metadata for a language in the Playground. */
export interface CodeLanguageMetadata {
	label: string;
	/** Icon class for the language, required for integration with `Monaco` quick pick */
	iconClass?: keyof Playground.types.Omitted<
		typeof classes,
		"playground-icon"
	>;
	defaultValue?: string;
}

/** All template languages available in the Playground. */
export const codeEditorTemplateLanguages = {
	[CodeLanguages.GoTemplate]: {
		label: GO_TEMPLATE_LANGUAGE_ALIASES[0],
		iconClass: "default_file",
	},
} as const satisfies Record<CodeTemplateLanguage, CodeLanguageMetadata>;

/** All data languages available in the Playground. */
export const codeEditorDataLanguages = {
	[CodeLanguages.JSON]: {
		label: "JSON",
		iconClass: "file_type_json",
		defaultValue: "{}",
	},
	[CodeLanguages.YAML]: {
		label: "YAML",
		iconClass: "file_type_yaml",
		defaultValue: "{}",
	},
	[CodeLanguages.TOML]: {
		label: TOML_LANGUAGE_ALIASES[0],
		iconClass: "file_type_toml",
		defaultValue: "",
	},
} as const satisfies Record<CodeDataLanguage, CodeLanguageMetadata>;

/** All output languages available in the Playground. */
export const codeEditorOutputLanguages = {
	[CodeLanguages.Plaintext]: {
		label: "Plaintext",
		iconClass: "file_type_text",
	},
	[CodeLanguages.Markdown]: {
		label: "Markdown",
		iconClass: "file_type_markdown",
	},
} as const satisfies Record<CodeOutputLanguage, CodeLanguageMetadata>;

/** The kind of editor in the Playground. */
export const enum CodeEditorKind {
	Context = "context",
	Output = "output",
}

/**
 * Create a list of language choices for the quick pick based on the editor kind
 * ({@link CodeEditorKind}).
 */
export function createLanguageChoices(props: {
	editorKind: CodeEditorKind;
}): IQuickPickItem[] {
	const { editorKind } = props;
	const languages = (
		editorKind === CodeEditorKind.Context
			? codeEditorDataLanguages
			: codeEditorOutputLanguages
	) as Record<string, CodeLanguageMetadata>;

	return Object.entries(languages).map(
		([language, { label, iconClass }]) => ({
			type: "item",
			id: language,
			label,
			iconClass:
				`playground-icon ${iconClass}` satisfies `${(typeof classes)["playground-icon"]} ${typeof iconClass}`,
			value: language,
			description: `(${language})`,
		}),
	);
}

/**
 * Mapping of language kind ({@link CodeLanguage}) to metadata
 * ({@link CodeLanguageMetadata}).
 */
export const languageMetadataById: ReadonlyMap<
	CodeLanguage,
	CodeLanguageMetadata
> = new Map(
	Object.entries({
		...codeEditorTemplateLanguages,
		...codeEditorDataLanguages,
		...codeEditorOutputLanguages,
	}) as [CodeLanguage, CodeLanguageMetadata][],
);
