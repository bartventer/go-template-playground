import type { editor } from "monaco-editor/esm/vs/editor/editor.api";
import type { BuiltinTheme } from "monaco-editor/esm/vs/editor/standalone/common/standaloneTheme";

export interface NativeEditorPreferences
	extends Pick<
		Required<editor.IEditorOptions & editor.IGlobalEditorOptions>,
		| "smoothScrolling"
		| "contextmenu"
		| "cursorBlinking"
		| "tabCompletion"
		| "wordWrap"
		| "lineNumbers"
	> {
	theme: BuiltinTheme | undefined;
	/** Whether to show the minimap */
	minimap: boolean;
}

export interface CustomEditorPreferences {
	/** Whether to automatically save the editor content */
	autoSave: boolean;
	/** Whether to display the editor in full screen mode */
	fullScreen: boolean;
	/** Whether to enable high contrast mode */
	highContrast: boolean;
}

export type EditorPreferences = NativeEditorPreferences &
	CustomEditorPreferences;

export type TextModelPreferences = Playground.types.Omitted<
	editor.ITextModelUpdateOptions,
	"bracketColorizationOptions"
>;
