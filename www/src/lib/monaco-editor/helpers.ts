import type { editor } from "monaco-editor/esm/vs/editor/editor.api";
import type { IStandaloneTheme } from "monaco-editor/esm/vs/editor/standalone/common/standaloneTheme";

export function isEditorThemeDataDefined(
	theme: IStandaloneTheme,
): theme is Playground.types.RequiredFor<IStandaloneTheme, "themeData"> {
	return theme.themeData !== undefined;
}

function vscodeCssVar(name: string): string {
	return `--vscode-${name.replace(/\./g, "-")}`;
}

export function applyEditorThemeData(
	target: HTMLElement,
	themeData: editor.IStandaloneThemeData,
): void {
	for (const [key, value] of Object.entries(themeData.colors)) {
		target.style.setProperty(vscodeCssVar(key), value);
	}
}
