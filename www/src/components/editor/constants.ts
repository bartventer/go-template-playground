import type { BuiltinTheme } from "monaco-editor/esm/vs/editor/standalone/common/standaloneTheme";

export const enum EditorAction {
	// Custom
	ChangeLanguageMode = "custom.editor.action.changeLanguageMode",
	PreviewMarkdown = "custom.editor.action.markdown.preview",
	// Built-in (for convenience)
	ClipboardCopy = "editor.action.clipboardCopyAction",
	FormatDocument = "editor.action.formatDocument",
	NavigateToLine = "editor.action.gotoLine",
	NavigateToNextMarker = "editor.action.marker.next",
	SelectAll = "editor.action.selectAll",
}

export const enum EditorContextKey {
	// Custom
	HasLanguageMode = "custom.editor.hasLanguageMode",
	MarkdownPreviewVisible = "custom.editor.markdownPreviewVisible",
	// Built-in (for convenience)
	EditorLanguageId = "editorLangId",
}

export const enum VsTheme {
	Vs = "vs",
	VsDark = "vs-dark",
	HcDark = "hc-black",
	HcLight = "hc-light",
}

export const enum AppTheme {
	Light = "light",
	Dark = "dark",
}

export const enum ControlSource {
	Keyboard = "keyboard",
	Mouse = "mouse",
	None = "",
}

export function isVsLightTheme(
	theme: BuiltinTheme,
): theme is VsTheme.Vs | VsTheme.HcLight {
	return [VsTheme.Vs, VsTheme.HcLight].includes(theme as VsTheme);
}
