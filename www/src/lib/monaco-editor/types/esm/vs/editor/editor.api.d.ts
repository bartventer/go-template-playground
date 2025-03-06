/**
 * This file is used to extend the monaco-editor types.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { editor } from "monaco-editor/esm/vs/editor/editor.api";
import type { StandaloneThemeService } from "monaco-editor/esm/vs/editor/standalone/browser/standaloneThemeService";
import type { BuiltinTheme } from "monaco-editor/esm/vs/editor/standalone/common/standaloneTheme";
declare module "monaco-editor/esm/vs/editor/editor.api" {
	declare namespace editor {
		interface ICodeEditorMetadata {
			variant: Playground.editor.Variant;
		}

		interface IStandaloneCodeEditor {
			/** Custom meta data */
			__meta: ICodeEditorMetadata;
			_standaloneThemeService: StandaloneThemeService;
		}

		interface ITextModel {
			getLanguageId(): Playground.CodeLanguage;
		}

		function setTheme(themeName: BuiltinTheme): void;
	}
}

declare global {
	interface DOMStringMap {
		/** Current theme of the editor. */
		vscodeTheme?: BuiltinTheme;
	}
}
