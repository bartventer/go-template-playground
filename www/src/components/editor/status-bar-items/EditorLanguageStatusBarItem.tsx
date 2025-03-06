import { languageMetadataById } from "@lib/monaco-editor/languages";
import { useDisposableRef } from "@utils/hooks";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import React, {
	memo,
	startTransition,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { useEditorInstance } from "../editor-provider";
import { useEditorLanguagePrompt } from "../hooks/useEditorLanguagePrompt";
import { EditorStatusBarItem } from "./EditorStatusBarItem";

type LanguageState = {
	label: string;
	isDisabled: boolean;
	tooltip: string;
};

const INITIAL_LANGUAGE_STATE = {
	label: "Loading...",
	isDisabled: true,
	tooltip: "Loading...",
} as const satisfies LanguageState;

const LANGUAGE_MODE_TOOLTIP = {
	selectable: "Select language mode",
	nonSelectable: "Active language (not configurable for this file)",
} as const;

const UNKNOWN_LANGUAGE = "Unknown";

export const EditorLanguageStatusBarItem: React.FC = memo(() => {
	const [value, setValue] = useState<LanguageState>(INITIAL_LANGUAGE_STATE);
	const instance = useEditorInstance();
	const [handleShowPrompt, promptEnabled] = useEditorLanguagePrompt();
	const onDidChangeModelRef = useDisposableRef();
	const onDidChangeModelLanguageRef = useDisposableRef();
	const isMounted = useRef(false);

	const updateLanguage = useCallback(
		(nextLanguageId?: Playground.CodeLanguage) => {
			const languageMetadata = !nextLanguageId
				? null
				: (languageMetadataById.get(nextLanguageId) ?? null);
			startTransition(() => {
				setValue({
					label: languageMetadata?.label ?? UNKNOWN_LANGUAGE,
					...(promptEnabled?.get()
						? {
								isDisabled: false,
								tooltip: LANGUAGE_MODE_TOOLTIP.selectable,
							}
						: {
								isDisabled: true,
								tooltip: LANGUAGE_MODE_TOOLTIP.nonSelectable,
							}),
				});
			});
		},
		[promptEnabled],
	);

	const onMount = useCallback(
		(codeEditor: NonNullable<typeof instance>) => {
			const model = codeEditor.getModel();
			updateLanguage(model?.getLanguageId());
		},
		[updateLanguage],
	);

	// Effect to manage language change events:
	// - switching tabs
	// - explicit language change
	useEffect(() => {
		if (!instance?.getModel()) return;
		// Triggered when tab is changed; use the default language of the file
		onDidChangeModelRef.current = instance.onDidChangeModel(
			({ newModelUrl }) => {
				if (!newModelUrl) return;
				updateLanguage(editor.getModel(newModelUrl)?.getLanguageId());
			},
		);
		// Triggered when the current tab's language is changed
		onDidChangeModelLanguageRef.current = instance.onDidChangeModelLanguage(
			(e) => {
				updateLanguage(e.newLanguage as Playground.CodeLanguage);
			},
		);

		return () => {
			onDidChangeModelRef.current?.dispose();
			onDidChangeModelLanguageRef.current?.dispose();
		};
	}, [instance, updateLanguage]);

	// Effect to set initial language state
	useEffect(() => {
		if (!isMounted.current && instance?.getModel()) {
			onMount(instance);
			isMounted.current = true;
		}
		return () => {
			isMounted.current = false;
		};
	}, [instance, onMount]);

	return (
		<EditorStatusBarItem
			ariaLabel={value.tooltip}
			onClick={handleShowPrompt}
			disabled={value.isDisabled}
		>
			{value.label}
		</EditorStatusBarItem>
	);
});
