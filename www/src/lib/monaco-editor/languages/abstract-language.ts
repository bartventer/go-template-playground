import type { Monaco } from "@monaco-editor/react";
import { languages } from "monaco-editor/esm/vs/editor/editor.api";

/**
 * Abstract base class for defining a custom language for the Monaco editor.
 * Subclasses must implement the abstract properties to provide language-specific details.
 */
export abstract class AbstractLanguage {
	public abstract readonly id: string;
	public abstract readonly extensions: ReadonlyArray<string>;
	public abstract readonly aliases: ReadonlyArray<string>;
	protected abstract readonly config: languages.LanguageConfiguration;
	protected abstract readonly language: languages.IMonarchLanguage;
	/**
	 * Registers the language with the Monaco editor and sets up the following features:
	 * - Monarch tokens provider for syntax highlighting.
	 * - Language configuration for features like comments, brackets, auto-closing pairs, etc.
	 *
	 * @param monaco - The Global Monaco instance.
	 * @returns void
	 */
	public register(monaco: Monaco): void {
		if (monaco.languages.getLanguages().some(({ id }) => id === this.id)) {
			console.warn(`Language "${this.id}" is already registered.`);
			return;
		}
		monaco.languages.register({
			id: this.id,
			extensions: [...this.extensions],
			aliases: [...this.aliases],
		});
		monaco.languages.setMonarchTokensProvider(this.id, this.language);
		monaco.languages.setLanguageConfiguration(this.id, this.config);

		console.debug(`Language "${this.id}" registered.`);
	}
}
