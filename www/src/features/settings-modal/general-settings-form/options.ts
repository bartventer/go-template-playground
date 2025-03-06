import { VsTheme } from "@components/editor/constants";
import type { editor } from "monaco-editor/esm/vs/editor/editor.api";
import type { BuiltinTheme } from "monaco-editor/esm/vs/editor/standalone/common/standaloneTheme";

export const editorThemeOptions = [
	{ value: VsTheme.Vs, label: "Light" },
	{ value: VsTheme.VsDark, label: "Dark" },
	// NOTE: High contrast themes are detected automatically
	// { value: VsTheme.HcLight, label: "High Contrast Light" },
	// { value: VsTheme.HcDark, label: "High Contrast Dark" },
] as const satisfies Array<Playground.components.LabeledOption<BuiltinTheme>>;

export const cursorBlinkingOptions = [
	{ value: "blink", label: "Blink" },
	{ value: "smooth", label: "Smooth" },
	{ value: "phase", label: "Phase" },
	{ value: "expand", label: "Expand" },
	{ value: "solid", label: "Solid" },
] as const satisfies Array<
	Playground.components.LabeledOption<
		Required<editor.IEditorOptions>["cursorBlinking"]
	>
>;

export const tabCompletionOptions = [
	{ value: "on", label: "On" },
	{ value: "off", label: "Off" },
	{ value: "onlySnippets", label: "Only Snippets" },
] as const satisfies Array<
	Playground.components.LabeledOption<
		Required<editor.IEditorOptions>["tabCompletion"]
	>
>;

export const lineNumbersOptions = [
	{ value: "on", label: "On" },
	{ value: "off", label: "Off" },
	{ value: "relative", label: "Relative" },
	{ value: "interval", label: "Interval" },
] as const satisfies Array<
	Playground.components.LabeledOption<editor.LineNumbersType & string>
>;

export const wordWrapOptions = [
	{ value: "on", label: "On" },
	{ value: "off", label: "Off" },
	{ value: "wordWrapColumn", label: "Word wrap column" },
	{ value: "bounded", label: "Bounded" },
] as const satisfies Array<
	Playground.components.LabeledOption<
		Required<editor.IEditorOptions>["wordWrap"]
	>
>;
