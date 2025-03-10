/**
 * Code generated by github.com/bartventer/go-template-playground/internal/tmpl/funcs.go; DO NOT EDIT.
 *
 * @file go-template.gen.ts
 * @summary TypeScript code for functions available in the Go template engine.
 * @description This file contains a list of functions available in the Go template engine, including built-in and custom functions.
 * @description The functions are categorized into groups such as Text, Time, Filepath, Math, etc.
 * 
 * @see https://pkg.go.dev/github.com/bartventer/go-template-playground/internal/tmpl
 * @see https://pkg.go.dev/text/template
 */

/** URL to the Go template engine documentation. */
export const FUNCTIONS_DOCUMENTATION_URL = "https://pkg.go.dev/github.com/bartventer/go-template-playground/internal/tmpl" as const;

/** List of function categories available in the Go template engine. */
export const templateFunctionCategories = [
	"Filepath",
	"Markdown",
	"Math",
	"Text",
	"Time",
] as const;

/** FunctionCategory represents a category of functions available in the Go template engine. */
export type TemplateFunctionCategory = typeof templateFunctionCategories[number];

/** TemplateBaseFunction represents a function with a name, signature, and category. */
interface TemplateBaseFunction {
	name: string;
	signature: string;
	category: TemplateFunctionCategory;
}

/** TemplateDescriptiveFunction represents a function with a description. */
interface TemplateDescriptiveFunction extends TemplateBaseFunction {
	description: string;
	url?: string;
}

/** TemplateURLFunction represents a function that has a URL to its documentation. */
interface TemplateURLFunction extends TemplateBaseFunction {
	url: string;
	description?: string;
}

/** TemplateFunction represents a function available in the Go template engine. */
export type TemplateFunction = TemplateDescriptiveFunction | TemplateURLFunction;

/** List of functions (built-in and custom) available in the Go template engine. */
export const templateFunctions: TemplateFunction[] = [
	{ name: 'abs', signature: 'func abs(path string) (string, error)', category: 'Filepath', url: 'https://pkg.go.dev/path/filepath#Abs' },
	{ name: 'base', signature: 'func base(path string) string', category: 'Filepath', url: 'https://pkg.go.dev/path/filepath#Base' },
	{ name: 'dir', signature: 'func dir(path string) string', category: 'Filepath', url: 'https://pkg.go.dev/path/filepath#Dir' },
	{ name: 'ext', signature: 'func ext(path string) string', category: 'Filepath', url: 'https://pkg.go.dev/path/filepath#Ext' },
	{ name: 'filepathJoin', signature: 'func filepathJoin(elem ...string) string', category: 'Filepath', url: 'https://pkg.go.dev/path/filepath#Join' },
	{ name: 'rel', signature: 'func rel(basepath, targpath string) (string, error)', category: 'Filepath', url: 'https://pkg.go.dev/path/filepath#Rel' },
	{ name: 'mdBold', description: 'mdBold returns s formatted as bold in markdown.', signature: 'func mdBold(s string) string', category: 'Markdown' },
	{ name: 'mdCode', description: 'mdCode returns s formatted as a code block in markdown.', signature: 'func mdCode(s string) string', category: 'Markdown' },
	{ name: 'mdEmoji', description: 'mdEmoji returns s formatted as an emoji in markdown.', signature: 'func mdEmoji(s string) string', category: 'Markdown' },
	{ name: 'mdFootnote', description: 'mdFootnote returns a markdown footnote with the specified number n and text s.', signature: 'func mdFootnote(n int, s string) string', category: 'Markdown' },
	{ name: 'mdFootnoteRef', description: 'mdFootnoteRef returns a markdown footnote reference with the specified number n.', signature: 'func mdFootnoteRef(n int) string', category: 'Markdown' },
	{ name: 'mdH1', description: 'mdH1 returns a level 1 markdown heading with the text s.', signature: 'func mdH1(s string) string', category: 'Markdown' },
	{ name: 'mdH2', description: 'mdH2 returns a level 2 markdown heading with the text s.', signature: 'func mdH2(s string) string', category: 'Markdown' },
	{ name: 'mdH3', description: 'mdH3 returns a level 3 markdown heading with the text s.', signature: 'func mdH3(s string) string', category: 'Markdown' },
	{ name: 'mdH4', description: 'mdH4 returns a level 4 markdown heading with the text s.', signature: 'func mdH4(s string) string', category: 'Markdown' },
	{ name: 'mdH5', description: 'mdH5 returns a level 5 markdown heading with the text s.', signature: 'func mdH5(s string) string', category: 'Markdown' },
	{ name: 'mdH6', description: 'mdH6 returns a level 6 markdown heading with the text s.', signature: 'func mdH6(s string) string', category: 'Markdown' },
	{ name: 'mdHR', description: 'mdHR returns a markdown horizontal rule.', signature: 'func mdHR() string', category: 'Markdown' },
	{ name: 'mdHeading', description: 'mdHeading returns a markdown heading with the text s at the specified level.', signature: 'func mdHeading(s string, level int) string', category: 'Markdown' },
	{ name: 'mdImage', description: 'mdImage returns a markdown image with the specified alt text and URL.', signature: 'func mdImage(alt, url string) string', category: 'Markdown' },
	{ name: 'mdItalic', description: 'mdItalic returns s formatted as italic in markdown.', signature: 'func mdItalic(s string) string', category: 'Markdown' },
	{ name: 'mdLink', description: 'mdLink returns a markdown link with the specified title and URL.', signature: 'func mdLink(title, url string) string', category: 'Markdown' },
	{ name: 'mdList', description: 'mdList returns a markdown list with the specified items.', signature: 'func mdList(items ...string) string', category: 'Markdown' },
	{ name: 'mdQuote', description: 'mdQuote returns s formatted as a blockquote in markdown.', signature: 'func mdQuote(s string) string', category: 'Markdown' },
	{ name: 'mdStrike', description: 'mdStrike returns s formatted as strikethrough in markdown.', signature: 'func mdStrike(s string) string', category: 'Markdown' },
	{ name: 'mdTableHeader', description: 'mdTableHeader returns a markdown table header row and separator with the specified headers.', signature: 'func mdTableHeader(headers ...string) string', category: 'Markdown' },
	{ name: 'mdTableRow', description: 'mdTableRow returns a markdown table row with the specified cells.', signature: 'func mdTableRow(cells ...string) string', category: 'Markdown' },
	{ name: 'mdTask', description: 'mdTask returns s formatted as an unchecked task list item in markdown.', signature: 'func mdTask(s string) string', category: 'Markdown' },
	{ name: 'mdTaskChecked', description: 'mdTaskChecked returns s formatted as a checked task list item in markdown.', signature: 'func mdTaskChecked(s string) string', category: 'Markdown' },
	{ name: 'acos', signature: 'func acos(x float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Acos' },
	{ name: 'add', description: 'add returns the sum of nums.', signature: 'func add(nums ...int) int', category: 'Math' },
	{ name: 'asin', signature: 'func asin(x float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Asin' },
	{ name: 'atan', signature: 'func atan(x float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Atan' },
	{ name: 'atan2', signature: 'func atan2(y, x float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Atan2' },
	{ name: 'ceil', signature: 'func ceil(x float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Ceil' },
	{ name: 'cos', signature: 'func cos(x float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Cos' },
	{ name: 'div', description: 'div returns the division of a by b.', signature: 'func div(a, b int) int', category: 'Math' },
	{ name: 'exp', signature: 'func exp(x float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Exp' },
	{ name: 'floor', signature: 'func floor(x float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Floor' },
	{ name: 'log', signature: 'func log(x float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Log' },
	{ name: 'log10', signature: 'func log10(x float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Log10' },
	{ name: 'log2', signature: 'func log2(x float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Log2' },
	{ name: 'mathAbs', signature: 'func mathAbs(x float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Abs' },
	{ name: 'max', signature: 'func max(x, y float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Max' },
	{ name: 'min', signature: 'func min(x, y float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Min' },
	{ name: 'mod', description: 'mod returns the remainder of the division of a by b.', signature: 'func mod(a, b int) int', category: 'Math' },
	{ name: 'mul', description: 'mul returns the product of a and b.', signature: 'func mul(a, b int) int', category: 'Math' },
	{ name: 'pow', signature: 'func pow(x, y float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Pow' },
	{ name: 'pow10', signature: 'func pow10(n int) float64', category: 'Math', url: 'https://pkg.go.dev/math#Pow10' },
	{ name: 'randInt', signature: 'func randInt(n int) int', category: 'Math', url: 'https://pkg.go.dev/math/rand/v2#IntN' },
	{ name: 'round', signature: 'func round(x float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Round' },
	{ name: 'sin', signature: 'func sin(x float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Sin' },
	{ name: 'sqrt', signature: 'func sqrt(x float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Sqrt' },
	{ name: 'sub', description: 'sub returns the difference of a and b.', signature: 'func sub(a, b int) int', category: 'Math' },
	{ name: 'tan', signature: 'func tan(x float64) float64', category: 'Math', url: 'https://pkg.go.dev/math#Tan' },
	{ name: 'contains', signature: 'func contains(s, substr string) bool', category: 'Text', url: 'https://pkg.go.dev/strings#Contains' },
	{ name: 'hasPrefix', signature: 'func hasPrefix(s, prefix string) bool', category: 'Text', url: 'https://pkg.go.dev/strings#HasPrefix' },
	{ name: 'hasSuffix', signature: 'func hasSuffix(s, suffix string) bool', category: 'Text', url: 'https://pkg.go.dev/strings#HasSuffix' },
	{ name: 'lcFirst', description: 'lcFirst converts the first character of s to lowercase.', signature: 'func lcFirst(s string) string', category: 'Text' },
	{ name: 'lower', signature: 'func lower(s string) string', category: 'Text', url: 'https://pkg.go.dev/strings#ToLower' },
	{ name: 'replaceAll', signature: 'func replaceAll(s, old, new string) string', category: 'Text', url: 'https://pkg.go.dev/strings#ReplaceAll' },
	{ name: 'split', signature: 'func split(s, sep string) []string', category: 'Text', url: 'https://pkg.go.dev/strings#Split' },
	{ name: 'stripNewLines', description: 'stripNewLines removes new lines from s. It will replace all sequences of new lines with a single space.', signature: 'func stripNewLines(s string) string', category: 'Text' },
	{ name: 'title', description: 'Converts the first character of each word to uppercase.', signature: 'func title (s string) string', category: 'Text' },
	{ name: 'trimPrefix', signature: 'func trimPrefix(s, prefix string) string', category: 'Text', url: 'https://pkg.go.dev/strings#TrimPrefix' },
	{ name: 'trimSpace', signature: 'func trimSpace(s string) string', category: 'Text', url: 'https://pkg.go.dev/strings#TrimSpace' },
	{ name: 'trimSuffix', signature: 'func trimSuffix(s, suffix string) string', category: 'Text', url: 'https://pkg.go.dev/strings#TrimSuffix' },
	{ name: 'ucFirst', description: 'ucFirst converts the first character of s to uppercase.', signature: 'func ucFirst(s string) string', category: 'Text' },
	{ name: 'upper', signature: 'func upper(s string) string', category: 'Text', url: 'https://pkg.go.dev/strings#ToUpper' },
	{ name: 'date', description: 'date returns the current date in the format "2006-01-02".', signature: 'func date() string', category: 'Time' },
	{ name: 'now', signature: 'func now() Time', category: 'Time', url: 'https://pkg.go.dev/time#Now' },
	
];

/** Map of functions by name available in the Go template engine. */
export const templateFunctionsByName : ReadonlyMap<string, TemplateFunction> = new Map(
	templateFunctions.map((fn) => [fn.name, fn])
);
