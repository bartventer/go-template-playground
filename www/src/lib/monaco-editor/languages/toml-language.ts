import type { languages } from "monaco-editor/esm/vs/editor/editor.api";
import { AbstractLanguage } from "./abstract-language";
import { CodeLanguages } from "./supported-languages";

const TOML_LANGUAGE_EXTENSIONS = [".toml"] as const;
export const TOML_LANGUAGE_ALIASES = ["TOML", "toml"] as const;

export class TOMLLanguage extends AbstractLanguage {
	public readonly id = CodeLanguages.TOML;
	public readonly extensions = TOML_LANGUAGE_EXTENSIONS;
	public readonly aliases = TOML_LANGUAGE_ALIASES;
	protected readonly config: languages.LanguageConfiguration = {
		comments: {
			lineComment: "#",
		},
		brackets: [["[", "]"]],
		wordPattern: /(-?\d*\.\d\w*)|([^[{}\],]+)/g,
		autoCloseBefore: ")]}",
		folding: {
			offSide: true,
			markers: {
				start: new RegExp("^\\s*\\["),
				end: new RegExp("^\\s*\\]"),
			},
		},
		indentationRules: {
			increaseIndentPattern: /^\s*\[[^\]]*$/,
			decreaseIndentPattern: /^\s*\]/,
		},
		autoClosingPairs: [
			{ open: "[", close: "]" },
			{ open: '"', close: '"', notIn: ["string"] },
			{ open: "'", close: "'", notIn: ["string", "comment"] },
		],
		surroundingPairs: [
			{ open: "[", close: "]" },
			{ open: '"', close: '"' },
			{ open: "'", close: "'" },
		],
	};
	protected readonly language: languages.IMonarchLanguage = {
		defaultToken: "",
		tokenPostfix: ".toml",
		keywords: ["true", "false"],
		operators: ["=", ","],
		symbols: /[=><!~?:&|+\-*/^%]+/,
		tokenizer: {
			root: [
				[/\[[^\]]*\]/, "keyword"],
				[/".*?"/, "string"],
				[/\d+/, "number"],
				[/true|false/, "keyword"],
				[/[a-zA-Z_]\w*/, "identifier"],
				[/=|,/, "delimiter"],
				[/#.*$/, "comment"],
			],
		},
	};
}
