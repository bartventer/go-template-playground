declare module "monaco-editor/esm/vs/editor/standalone/common/standaloneTheme" {
	import { Color } from "../../../base/common/color.js";
	import { TokenTheme } from "../../common/languages/supports/tokenization.js";
	import {
		IColorTheme,
		IThemeService,
	} from "monaco-editor/esm/vs/platform/theme/common/themeService.js";
	import type { editor } from "monaco-editor/esm/vs/editor/editor.api"; // Custom import
	export type BuiltinTheme = "vs" | "vs-dark" | "hc-black" | "hc-light";
	export interface IStandaloneTheme extends IColorTheme {
		tokenTheme: TokenTheme;
		// Custom properties
		/** Override to include theme data */
		themeData?: editor.IStandaloneThemeData;
		/** Override for better type checking */
		themeName: BuiltinTheme;
	}
	export interface IStandaloneThemeService extends IThemeService {
		readonly _serviceBrand: undefined;
		setTheme(themeName: string): void;
		setAutoDetectHighContrast(autoDetectHighContrast: boolean): void;
		defineTheme(themeName: string, themeData: unknown): void;
		getColorTheme(): IStandaloneTheme;
		setColorMapOverride(colorMapOverride: Color[] | null): void;
	}
}
