import {
	CodeLanguages,
	validateGoTemplate,
} from "@lib/monaco-editor/languages";
import { useDisposableRef } from "@utils/hooks";
import { useCallback, useEffect, useRef } from "react";
import { useEditorInstance } from "../editor-provider";

/**
 * Custom hook that sets up language-specific validation for the editor instance.
 *
 * This hook listens for changes in the editor's model content and triggers validation
 * based on the language of the model. Currently, it supports validation for Go Template language.
 */
export function useEditorLanguageValidationEffect(): void {
	const instance = useEditorInstance();
	const onDidChangeModelContentRef = useDisposableRef();
	const isMounted = useRef(false);

	const validate = useCallback((codeEditor: NonNullable<typeof instance>) => {
		const model = codeEditor.getModel();
		if (!model) return;
		switch (model.getLanguageId()) {
			case CodeLanguages.GoTemplate:
				validateGoTemplate(model);
				break;
			default:
				break;
		}
	}, []);

	useEffect(() => {
		if (!instance?.getModel()) return;
		onDidChangeModelContentRef.current = instance.onDidChangeModelContent(
			() => validate(instance),
		);
		if (!isMounted.current) {
			validate(instance);
			isMounted.current = true;
		}
		return () => {
			onDidChangeModelContentRef.current?.dispose();
			isMounted.current = false;
		};
	}, [instance, validate]);

	return;
}
