declare module "monaco-editor/esm/vs/platform/theme/common/themeService.js" {
	import { Color } from "../../../base/common/color.js";
	import { Event } from "../../../base/common/event.js";
	import { Disposable } from "../../../base/common/lifecycle";
	import { ColorIdentifier } from "./colorRegistry.js";
	import { IconContribution } from "./iconRegistry.js";
	import { ColorScheme } from "./theme.js";
	export interface ITokenStyle {
		readonly foreground: number | undefined;
		readonly bold: boolean | undefined;
		readonly underline: boolean | undefined;
		readonly strikethrough: boolean | undefined;
		readonly italic: boolean | undefined;
	}
	export interface IColorTheme {
		readonly type: ColorScheme;
		readonly label: string;
		/**
		 * Resolves the color of the given color identifier. If the theme does not
		 * specify the color, the default color is returned unless <code>useDefault</code> is set to false.
		 * @param color the id of the color
		 * @param useDefault specifies if the default color should be used. If not set, the default is used.
		 */
		getColor(color: ColorIdentifier, useDefault?: boolean): unknown;
		/**
		 * Returns whether the theme defines a value for the color. If not, that means the
		 * default color will be used.
		 */
		defines(color: ColorIdentifier): boolean;
		/**
		 * Returns the token style for a given classification. The result uses the <code>MetadataConsts</code> format
		 */
		getTokenStyleMetadata(
			type: string,
			modifiers: string[],
			modelLanguage: string,
		): ITokenStyle | undefined;
		/**
		 * List of all colors used with tokens. <code>getTokenStyleMetadata</code> references the colors by index into this list.
		 */
		readonly tokenColorMap: string[];
		/**
		 * Defines whether semantic highlighting should be enabled for the theme.
		 */
		readonly semanticHighlighting: boolean;
	}
	export interface IFileIconTheme {
		readonly hasFileIcons: boolean;
		readonly hasFolderIcons: boolean;
		readonly hidesExplorerArrows: boolean;
	}
	export interface IProductIconTheme {
		/**
		 * Resolves the definition for the given icon as defined by the theme.
		 *
		 * @param iconContribution The icon
		 */
		getIcon(iconContribution: IconContribution): unknown;
	}

	export interface IThemeService {
		readonly _serviceBrand: undefined;
		getColorTheme(): IColorTheme;
		readonly onDidColorThemeChange: Event<IColorTheme>;
		getFileIconTheme(): IFileIconTheme;
		readonly onDidFileIconThemeChange: Event<IFileIconTheme>;
		getProductIconTheme(): IProductIconTheme;
		readonly onDidProductIconThemeChange: Event<IProductIconTheme>;
	}
	/**
	 * Utility base class for all themable components.
	 */
	export declare class Themable extends Disposable {
		protected themeService: IThemeService;
		protected theme: IColorTheme;
		constructor(themeService: IThemeService);
		protected onThemeChange(theme: IColorTheme): void;
		updateStyles(): void;
		protected getColor(
			id: string,
			modify?: (color: Color, theme: IColorTheme) => Color,
		): string | null;
	}
}
