import {
	FUNCTIONS_DOCUMENTATION_URL,
	templateFunctions,
	templateFunctionsByName,
} from "@generated";
import type { Monaco } from "@monaco-editor/react";
import {
	editor,
	MarkerSeverity,
	type languages,
	type Range,
} from "monaco-editor/esm/vs/editor/editor.api";
import { AbstractLanguage } from "./abstract-language";
import { CodeLanguages } from "./supported-languages";

const GO_TEMPLATE_LANGUAGE_EXTENSIONS = [
	".go.txt",
	".go.tpl",
	".go.tmpl",
	".gtpl",
] as const;

export const GO_TEMPLATE_LANGUAGE_ALIASES = ["Go Template"] as const;

const GO_TEMPLATE_LANGUAGE_KEYWORDS = [
	"define",
	"block",
	"template",
	"with",
	"if",
	"else",
	"range",
	"end",
];

export function validateGoTemplate(model: editor.ITextModel) {
	const markers: editor.IMarkerData[] = [];
	const lines = model.getLinesContent();
	const stack: string[] = [];

	for (let i = 0; i < lines.length; i++) {
		const lineNumber = i + 1;
		const lineContent = lines[i];

		// Check for unclosed braces
		const openBraces = (lineContent.match(/{/g) || []).length;
		const closeBraces = (lineContent.match(/}/g) || []).length;
		if (openBraces !== closeBraces) {
			markers.push({
				message: "Mismatched braces",
				severity: MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: lineContent.length + 1,
			});
		}

		// Check for unclosed tags
		const openTags = lineContent.match(/{{\s*(\w+)/g);
		const closeTags = lineContent.match(/{{\s*end\s*}}/g);
		if (openTags) {
			openTags.forEach((tag) => {
				const tagName = tag.replace(/{{\s*/, "");
				stack.push(tagName);
			});
		}
		if (closeTags) {
			closeTags.forEach(() => {
				if (stack.length === 0) {
					markers.push({
						message: "Unmatched end tag",
						severity: MarkerSeverity.Error,
						startLineNumber: lineNumber,
						startColumn: 1,
						endLineNumber: lineNumber,
						endColumn: lineContent.length + 1,
					});
				} else {
					stack.pop();
				}
			});
		}

		// Check for invalid keywords
		const invalidKeywords = lineContent.match(/{{\s*(\w+)\s*}}/g);
		if (invalidKeywords) {
			invalidKeywords.forEach((keyword) => {
				const keywordName = keyword.replace(/{{\s*|\s*}}/g, "");
				if (!GO_TEMPLATE_LANGUAGE_KEYWORDS.includes(keywordName)) {
					markers.push({
						message: `Invalid keyword: ${keywordName}`,
						severity: MarkerSeverity.Error,
						startLineNumber: lineNumber,
						startColumn: 1,
						endLineNumber: lineNumber,
						endColumn: lineContent.length + 1,
					});
				}
			});
		}
	}

	editor.setModelMarkers(model, CodeLanguages.GoTemplate, markers);
}

type CompletionItemBase = Playground.types.Omitted<
	languages.CompletionItem,
	"kind" | "insertTextRules" | "range"
>;

const stdLibSuggestions: CompletionItemBase[] = [
	{
		label: "if",
		insertText: "{{if ${1:condition}}}\n\t${2:code}\n{{end}}",
		documentation: "Snippet for creating gotmpl if",
	},
	{
		label: "ifelse",
		insertText:
			"{{if ${1:condition}}}\n\t${2:code}\n{{else}}\n\t${3:code}\n{{end}}",
		documentation: "Snippet for creating gotmpl if else",
	},
	{
		label: "elseif",
		insertText: "{{else if ${1:condition}}}\n\t${2:code}",
		documentation: "Snippet for creating gotmpl else if",
	},
	{
		label: "else",
		insertText: "{{else}}\n\t${1:code}",
		documentation: "Snippet for creating gotmpl else",
	},
	{
		label: "range",
		insertText: "{{range ${1:range}}}\n\t${2:code}\n{{end}}",
		documentation: "Snippet for creating gotmpl range",
	},
	{
		label: "rangeelse",
		insertText:
			"{{range ${1:range}}}\n\t${2:code}\n{{else}}\n\t${3:code}\n{{end}}",
		documentation: "Snippet for creating gotmpl range else",
	},
	{
		label: "with",
		insertText: "{{with ${1:with}}}\n\t${2:code}\n{{end}}",
		documentation: "Snippet for creating gotmpl with",
	},
	{
		label: "withelse",
		insertText:
			"{{with ${1:with}}}\n\t${2:code}\n{{else}}\n\t${3:code}\n{{end}}",
		documentation: "Snippet for creating gotmpl with else",
	},
	{
		label: "template",
		insertText: '{{template "${1:template_name}" .}}',
		documentation: "Snippet for creating gotmpl template",
	},
	{
		label: "define",
		insertText: '{{define "${1:template_name}"}}\n\t${2:code}\n{{end}}',
		documentation: "Snippet for creating gotmpl define",
	},
	{
		label: "block",
		insertText: '{{block "${1:template_name}" .}}\n\t${2:code}\n{{end}}',
		documentation: "Snippet for creating gotmpl block",
	},
	{
		label: "include",
		insertText: '{{include "${1:template_name}" .}}',
		documentation: "Snippet for creating gotmpl include",
	},
	{
		label: "var",
		insertText: "{{\\$${1:varname} := ${2:pipeline}}}",
		documentation: "Snippet for declaring gotmpl variable",
	},
	{
		label: "comment",
		insertText: "{{- /* ${1:comment} */}}",
		documentation: "Snippet for creating gotmpl comment",
	},
	{
		label: "commentblock",
		insertText: "{{/*\n\t${1:comment}\n*/}}",
		documentation: "Snippet for creating gotmpl comment block",
	},
];

/**
 * Generate completion items for standard library functions
 *
 * @param monaco  The Monaco instance
 * @param range  The range of the completion item
 * @returns  An array of completion items
 *
 * @example
 * generateStdLibSuggestions(monaco, range);
 * // => [{ label: "if", kind: 17, insertText: "{{if ${1:condition}}}" }]
 */
function generateStdLibSuggestions(
	monaco: Monaco,
	range: Range,
): languages.CompletionItem[] {
	return stdLibSuggestions.map((suggestion) => {
		return {
			...suggestion,
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertTextRules:
				monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		};
	});
}

const customFuncsSuggestions: CompletionItemBase[] = templateFunctions.map(
	(func) => {
		const params = func.signature
			.split("(")[1]
			.split(")")[0]
			.split(",")
			.map((param, i) => {
				const [paramName, paramType] = param.trim().split(" ");
				const isNumberType =
					/int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|float32|float64|complex64|complex128/.test(
						paramType,
					);
				const placeholder = isNumberType
					? `\${${i + 1}:0}`
					: `"\${${i + 1}:${paramName}}"`;
				return placeholder;
			})
			.join(" ");
		return {
			label: func.name,
			insertText: `{{ ${func.name} ${params} }}`,
			documentation: func.description || func.url || func.signature,
			detail: func.signature,
		};
	},
);

/**
 * Generate completion items for custom functions
 *
 * @param monaco  The Monaco instance
 * @param range  The range of the completion item
 * @returns  An array of completion items
 *
 * @example
 * generateCustomFuncsSuggestions(monaco, range);
 * // => [{ label: "add", kind: 17, insertText: "{{ add ${1:0} ${2:0} }}" }]
 */
function generateCustomFuncsSuggestions(monaco: Monaco, range: Range) {
	return customFuncsSuggestions.map((suggestion) => {
		return {
			...suggestion,
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertTextRules:
				monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			range: range,
		};
	});
}

export class GoTemplateLanguage extends AbstractLanguage {
	public id = CodeLanguages.GoTemplate;
	public extensions = GO_TEMPLATE_LANGUAGE_EXTENSIONS;
	public aliases = GO_TEMPLATE_LANGUAGE_ALIASES;
	protected config: languages.LanguageConfiguration = {
		comments: {
			lineComment: "//",
			blockComment: ["/*", "*/"],
		},
		brackets: [
			["{", "}"],
			["[", "]"],
			["(", ")"],
		],
		autoClosingPairs: [
			{ open: "{", close: "}" },
			{ open: "[", close: "]" },
			{ open: "(", close: ")" },
			{ open: "`", close: "`", notIn: ["string"] },
			{ open: '"', close: '"', notIn: ["string"] },
			{ open: "'", close: "'", notIn: ["string", "comment"] },
		],
		surroundingPairs: [
			{ open: "{", close: "}" },
			{ open: "[", close: "]" },
			{ open: "(", close: ")" },
			{ open: "`", close: "`" },
			{ open: '"', close: '"' },
			{ open: "'", close: "'" },
		],
	};
	protected language: languages.IMonarchLanguage = {
		defaultToken: "",
		tokenPostfix: ".gotmpl",
		keywords: GO_TEMPLATE_LANGUAGE_KEYWORDS,
		operators: ["=", ":", "|", ".", "(", ")", "[", "]", "{", "}"],
		symbols: /[=><!~?:&|+\-*/^%]+/,
		escapes:
			/\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
		tokenizer: {
			root: [
				[
					/[a-zA-Z_]\w*/,
					{
						cases: {
							"@keywords": { token: "keyword.$0" },
							"@default": "identifier",
						},
					},
				],
				{ include: "@whitespace" },
				[/[{}()[\]]/, "@brackets"],
				[
					/@symbols/,
					{
						cases: {
							"@operators": "delimiter",
							"@default": "",
						},
					},
				],
				[/\d*\d+[eE]([-+]?\d+)?/, "number.float"],
				[/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
				[/0[xX][0-9a-fA-F']*[0-9a-fA-F]/, "number.hex"],
				[/0[0-7']*[0-7]/, "number.octal"],
				[/0[bB][0-1']*[0-1]/, "number.binary"],
				[/\d[\d']*/, "number"],
				[/\d/, "number"],
				[/[;,.]/, "delimiter"],
				[/"([^"\\]|\\.)*$/, "string.invalid"],
				[/"/, "string", "@string"],
				[/`/, "string", "@rawstring"],
				[/'[^\\']'/, "string"],
				[/(')(@escapes)(')/, ["string", "string.escape", "string"]],
				[/'/, "string.invalid"],
			],
			whitespace: [
				[/[ \t\r\n]+/, ""],
				[/\/\*\*(?!\/)/, "comment.doc", "@doccomment"],
				[/\/\*/, "comment", "@comment"],
				[/\/\/.*$/, "comment"],
			],
			comment: [
				[/[^/*]+/, "comment"],
				[/\*\//, "comment", "@pop"],
				[/[/*]/, "comment"],
			],
			doccomment: [
				[/[^/*]+/, "comment.doc"],
				[/\/\*/, "comment.doc.invalid"],
				[/\*\//, "comment.doc", "@pop"],
				[/[/*]/, "comment.doc"],
			],
			string: [
				[/[^\\"]+/, "string"],
				[/@escapes/, "string.escape"],
				[/\\./, "string.escape.invalid"],
				[/"/, "string", "@pop"],
			],
			rawstring: [
				[/[^`]/, "string"],
				[/`/, "string", "@pop"],
			],
		},
	};

	public register(monaco: Monaco): void {
		super.register(monaco);

		// Register completion items provider
		monaco.languages.registerCompletionItemProvider(this.id, {
			provideCompletionItems: (model, position) => {
				const word = model.getWordUntilPosition(position);

				const range = new monaco.Range(
					position.lineNumber,
					word.startColumn,
					position.lineNumber,
					word.endColumn,
				);

				return {
					suggestions: [
						...generateStdLibSuggestions(monaco, range),
						...generateCustomFuncsSuggestions(monaco, range),
					],
				};
			},
		});

		// Register hover provider
		monaco.languages.registerHoverProvider(this.id, {
			provideHover: (model, position) => {
				const word = model.getWordAtPosition(position);
				if (!word) {
					return null;
				}

				const func = templateFunctionsByName.get(word.word);
				if (!func) {
					return null;
				}

				return {
					range: new monaco.Range(
						position.lineNumber,
						word.startColumn,
						position.lineNumber,
						word.endColumn,
					),
					contents: [
						{
							value: `**${func.name}**\n\n\`\`\`go\n${func.signature}\n\`\`\`${
								func.description
									? `\n\n${func.description}`
									: ""
							}\n\n[Learn more](${func.url || FUNCTIONS_DOCUMENTATION_URL + "/" + func.name})`,
						},
					],
				};
			},
		});
	}
}
