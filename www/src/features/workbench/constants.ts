import {
	textModelDataFile,
	textModelOutputFile,
	type TextModelPath,
} from "@components/editor/data";

/**
 * Enum representing different layout areas in the application.
 *
 * @enum {string}
 * @readonly
 */
export const enum LayoutArea {
	Header = "header",
	Content = "content",
	Footer = "footer",
}

/**
 * Enum representing different content areas in the application.
 *
 * @enum {string}
 * @readonly
 */
export const enum ContentArea {
	Template = "template",
	Data = "data",
	Output = "output",
}

/**
 * Enum representing different layout variants for the content area.
 *
 * @enum {string}
 * @readonly
 */
export const enum LayoutVariant {
	// Single layouts
	OutputBottom = "OutputBottom", // (Template top-left (50%), Data top-right (50%), Output bottom (100%))
	OutputRight = "OutputRight", // (Template left-top (50%), Data bottom-left (50%), Output right (100%))
	OutputLeft = "OutputLeft", // (Template right-top (50%), Data bottom-right (50%), Output left (100%))
	// Tabbed layouts
	VerticalSplit = "VerticalSplit", // (Top tabs for template and data, bottom output)
	HorizontalSplit = "HorizontalSplit", // (Left tabs for template and data, right output)
	Tabs = "Tabs", // (Tabs for template, data, output)
}

/**
 * A mapping of layout variants to arrays of hidden file paths.
 */
export const layoutHiddenFilePaths: Record<
	LayoutVariant,
	readonly TextModelPath[]
> = {
	// Single layouts (no hidden files)
	[LayoutVariant.OutputBottom]: [] as const,
	[LayoutVariant.OutputRight]: [] as const,
	[LayoutVariant.OutputLeft]: [] as const,
	// Tabbed layouts
	[LayoutVariant.Tabs]: [
		textModelDataFile.path,
		textModelOutputFile.path,
	] as const,
	[LayoutVariant.VerticalSplit]: [textModelDataFile.path] as const,
	[LayoutVariant.HorizontalSplit]: [textModelDataFile.path] as const,
};
