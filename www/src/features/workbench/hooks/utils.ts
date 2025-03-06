import type { editor } from "monaco-editor/esm/vs/editor/editor.api";

/**
 * Creates encoder options based on the provided text model configuration.
 *
 * @remarks
 * If no configuration is provided, the options will default to no indentation.
 */
export function createEncoderOptions(
	config?: editor.TextModelResolvedOptions,
): Playground.EncoderOptions {
	return {
		...(!config
			? {
					noIndent: true,
				}
			: {
					insertSpaces: config.insertSpaces,
					indentSize: config.insertSpaces
						? config.tabSize
						: config.indentSize,
				}),
	};
}
