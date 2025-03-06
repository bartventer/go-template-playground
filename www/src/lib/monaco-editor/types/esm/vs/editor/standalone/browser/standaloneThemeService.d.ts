declare module "monaco-editor/esm/vs/editor/standalone/browser/standaloneThemeService" {
	import { Color } from "../../../base/common/color.js";
	import {
		IStandaloneTheme,
		IStandaloneThemeData,
		IStandaloneThemeService,
	} from "monaco-editor/esm/vs/editor/standalone/common/standaloneTheme";
	import {
		IFileIconTheme,
		IProductIconTheme,
	} from "monaco-editor/esm/vs/platform/theme/common/themeService.js";
	import { Emitter } from "monaco-editor/esm/vs/base/common/event";
	import {
		IDisposable,
		Disposable,
	} from "monaco-editor/esm/vs/base/common/lifecycle";

	export declare class StandaloneThemeService
		extends Disposable
		implements IStandaloneThemeService
	{
		readonly _serviceBrand: undefined;
		private readonly _onColorThemeChange;
		readonly onDidColorThemeChange: Emitter<IStandaloneTheme>["event"];
		private readonly _onFileIconThemeChange;
		readonly onDidFileIconThemeChange: Emitter<IFileIconTheme>["event"];
		private readonly _onProductIconThemeChange;
		readonly onDidProductIconThemeChange: Emitter<IProductIconTheme>["event"];
		private readonly _environment;
		private readonly _knownThemes;
		private _autoDetectHighContrast;
		private _codiconCSS;
		private _themeCSS;
		private _allCSS;
		private _globalStyleElement;
		private _styleElements;
		private _colorMapOverride;
		private _theme;
		private _builtInProductIconTheme;
		constructor();
		registerEditorContainer(domNode: HTMLElement): IDisposable;
		private _registerRegularEditorContainer;
		private _registerShadowDomContainer;
		defineTheme(themeName: string, themeData: IStandaloneThemeData): void;
		getColorTheme(): IStandaloneTheme;
		setColorMapOverride(colorMapOverride: Color[] | null): void;
		setTheme(themeName: string): void;
		private _updateActualTheme;
		private _onOSSchemeChanged;
		setAutoDetectHighContrast(autoDetectHighContrast: boolean): void;
		private _updateThemeOrColorMap;
		private _updateCSS;
		getFileIconTheme(): IFileIconTheme;
		getProductIconTheme(): IProductIconTheme;
	}
}
