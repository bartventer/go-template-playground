import {
	textModelDataFile,
	textModelOutputFile,
	textModelTemplateFile,
	type TextModelPath,
} from "@components/editor/data";
import type { EditorPreferences, TextModelPreferences } from "../types";

export const editorPreferencesDefaults = {
	theme: "vs-dark",
	cursorBlinking: "blink",
	tabCompletion: "off",
	smoothScrolling: false,
	contextmenu: true,
	autoSave: false,
	fullScreen: true,
	highContrast: false,
	lineNumbers: "on",
	wordWrap: "on",
	minimap: true,
} as const satisfies EditorPreferences;

/**
 * A read-only map containing default preferences for text models.
 * Each entry in the map associates a file path with its corresponding preferences.
 */
export const textModelPreferencesDefaults: ReadonlyMap<
	TextModelPath,
	TextModelPreferences
> = new Map([
	[
		textModelTemplateFile.path,
		{
			trimAutoWhitespace: true,
			insertSpaces: false,
			tabSize: 2,
			indentSize: 2,
		},
	],
	[
		textModelDataFile.path,
		{
			trimAutoWhitespace: true,
			insertSpaces: false,
			tabSize: 2,
			indentSize: 2,
		},
	],
	[
		textModelOutputFile.path,
		{
			trimAutoWhitespace: true,
			insertSpaces: false,
			tabSize: 2,
			indentSize: 2,
		},
	],
]);
