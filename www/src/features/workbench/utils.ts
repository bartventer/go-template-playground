import {
	type TextModelPath,
	textModelFilesByUri,
} from "@components/editor/data";
import {
	codeEditorDataLanguages,
	codeEditorTemplateLanguages,
} from "@lib/monaco-editor/languages";
import { Uri, editor } from "monaco-editor/esm/vs/editor/editor.api";

export function isCodeDataLanguage(
	languageId: string,
): languageId is Playground.CodeDataLanguage {
	return languageId in codeEditorDataLanguages;
}

export function isCodeTemplateLanguage(
	languageId: string,
): languageId is Playground.CodeTemplateLanguage {
	return languageId in codeEditorTemplateLanguages;
}

/**
 * Replace the text content of the model with the given value.
 *
 * NOTE: The `undo` stack is updated for the operation.
 */
export function replaceModelText(
	model: editor.ITextModel | null,
	value: string,
): void {
	model?.pushEditOperations(
		[],
		[
			{
				range: model.getFullModelRange(),
				text: value,
			},
		],
		() => null,
	);
}

export function getOrCreateModel(path: TextModelPath): void {
	const uri = Uri.parse(path);
	if (editor.getModel(uri)) {
		return;
	}
	const file = textModelFilesByUri.get(path);
	if (!file) {
		return;
	}
	editor.createModel(file.defaultValue || "", file.defaultLanguage.id, uri);
}
