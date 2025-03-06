import { useDisposableRef } from "@utils/hooks";
import {
	editor,
	KeyCode,
	KeyMod,
} from "monaco-editor/esm/vs/editor/editor.api";
import { IQuickInputService } from "monaco-editor/esm/vs/platform/quickinput/common/quickInput";
import { useCallback, useEffect, useRef } from "react";
import { ControlSource, EditorAction, EditorContextKey } from "../constants";
import { useEditorAction } from "./useEditorAction";
import { textModelFilesByUri } from "../data";
import { useEditorInstance } from "../editor-provider";

const languagePrompt = {
	label: "Change Language Mode",
	placeholder: "Select Language Mode",
	activeItemSuffix: " - (Configured Language)",
} as const;

interface ServiceInvoker<T> {
	(
		accessor: { get: (service: T) => T },
		callback: (service: T) => void,
	): void;
}

const quickInputHandler: ServiceInvoker<IQuickInputService> = (
	accessor,
	callbackfn,
) => {
	const inputService = accessor.get(IQuickInputService as IQuickInputService);
	callbackfn(inputService);
};

/**
 * Create a command handler that triggers a quick input to change the language mode of the editor.
 * @param commandId The ID of the command to trigger the quick input.
 */
const createLanguagePickerPrompt: (
	commandId: string,
) => editor.IActionDescriptor["run"] = (commandId) => (codeEditor) => {
	const model = codeEditor.getModel();
	if (!model) return;

	const choices = [
		...(textModelFilesByUri.get(model.uri.toString())?.languageChoices ??
			[]),
	];
	if (!choices.length) return;

	const activeLanguage = model.getLanguageId();
	for (let i = 0; i < choices.length; i++) {
		if (choices[i].id === activeLanguage) {
			choices[i] = {
				...choices[i],
				description:
					choices[i].description + languagePrompt.activeItemSuffix,
			};
			break;
		}
	}

	return codeEditor.trigger(
		ControlSource.None,
		commandId,
		(quickInput: IQuickInputService) => {
			quickInput
				.pick(choices, {
					placeHolder: languagePrompt.placeholder,
					activeItem: choices.find(
						(choice) => choice.id === activeLanguage,
					),
				})
				.then((selected) => {
					if (!selected || !selected.id) return;
					const model = codeEditor.getModel();
					if (!model) return;
					editor.setModelLanguage(model, selected.id);
				})
				.catch(console.error);
		},
	);
};

type UseEditorLanguagePromptReturn = [
	showPrompt: () => void,
	promptEnabled: editor.IContextKey<boolean> | null,
];

/**
 * Custom hook to manage the language selection prompt in the editor.
 *
 * This hook sets up a context key to enable or disable the language mode change prompt
 * based on the current file's support for language choices. It also adds a command
 * to change the language mode of the editor via quick input, triggered by `Ctrl/Cmd + K, M`.
 *
 * @returns A tuple containing:
 * - `showPrompt`: A function to show the language selection prompt.
 * - `promptEnabledRef.current`: A reference to the context key indicating if the prompt is enabled.
 *
 * @see https://github.com/microsoft/monaco-editor/issues/683#issuecomment-1132937364
 */
export function useEditorLanguagePrompt(): UseEditorLanguagePromptReturn {
	const instance = useEditorInstance();
	const onDidChangeModelRef = useDisposableRef();
	const promptActionRef = useDisposableRef();

	// Context key to enable/disable the language mode change prompt
	// This is set to `null` initially and is updated when the editor instance is available
	// If the file corresponding to the editor instance supports language choices, this context key is set to `true`
	const promptEnabledRef = useRef<editor.IContextKey<boolean> | null>(null);

	const showPrompt = useEditorAction(
		instance,
		EditorAction.ChangeLanguageMode,
		{
			source: ControlSource.Keyboard,
			payload: {},
		},
	);

	const handleShowPrompt = useCallback(() => {
		if (!instance?.getModel()) return;
		instance.focus();
		showPrompt();
	}, [instance]);

	useEffect(() => {
		if (!instance?.getModel()) return;
		if (!promptEnabledRef.current) {
			// Initial context key setup
			const model = instance.getModel()!;
			const file = textModelFilesByUri.get(model.uri.toString());
			promptEnabledRef.current = instance.createContextKey(
				EditorContextKey.HasLanguageMode,
				!!file?.languageChoices?.length,
			);
		}

		// When the current file changes, update the context key
		onDidChangeModelRef.current = instance.onDidChangeModel((e) => {
			if (!e.newModelUrl) return;
			const file = textModelFilesByUri.get(e.newModelUrl.toString());
			if (!file) return;
			promptEnabledRef.current?.set(!!file.languageChoices?.length);
		});

		const commandId = instance.addCommand(
			0,
			quickInputHandler,
			EditorContextKey.HasLanguageMode,
		);

		if (!commandId) {
			console.error("Failed to add quick input command");
			return;
		}

		/**
		 * Add a command to change the language mode of the editor via quick input, subject to the condition
		 * that the current file provides quick pick support.
		 * The command is triggered by pressing `Ctrl/Cmd + K, M`.
		 */
		promptActionRef.current = instance.addAction({
			id: EditorAction.ChangeLanguageMode,
			label: languagePrompt.label,
			keybindings: [
				KeyMod.chord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyM),
			],
			precondition: EditorContextKey.HasLanguageMode,
			run: createLanguagePickerPrompt(commandId),
		});

		return () => {
			promptActionRef.current?.dispose();
			onDidChangeModelRef.current?.dispose;
		};
	}, [instance]);

	return [handleShowPrompt, promptEnabledRef.current] as const;
}
