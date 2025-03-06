import { useDisposableRef } from "@utils/hooks";
import React, { useCallback, useEffect, useRef } from "react";
import { EditorAction } from "../constants";
import { useEditorAction } from "../hooks";
import { useEditorInstance } from "../editor-provider";
import { EditorStatusBarItem } from "./EditorStatusBarItem";

const INITIAL_CURSOR_POSITION = "Ln 1, Col 1";

export const EditorCursorStatusBarItem: React.FC = () => {
	const instance = useEditorInstance();
	const cursorSpanRef = useRef<HTMLSpanElement>(null);
	const selectionSpanRef = useRef<HTMLSpanElement>(null);
	const onDidChangeCursorPositionRef = useDisposableRef();
	const onDidChangeModelRef = useDisposableRef();
	const onDidChangeCursorSelectionRef = useDisposableRef();
	const isMounted = useRef(false);

	const navigateToLine = useEditorAction(
		instance,
		EditorAction.NavigateToLine,
	);

	const handleNavigateToLine = useCallback(() => {
		instance?.focus();
		navigateToLine();
	}, [instance, navigateToLine]);

	const updateSelection = useCallback(
		(codeEditor: NonNullable<typeof instance>) => {
			if (!selectionSpanRef.current) return;
			const selection = codeEditor.getSelection();
			if (!selection || selection.isEmpty()) {
				selectionSpanRef.current.textContent = "";
			} else {
				const model = codeEditor.getModel();
				if (!model) return;
				const startOffset = model.getOffsetAt({
					lineNumber: selection.startLineNumber,
					column: selection.startColumn,
				});
				const endOffset = model.getOffsetAt({
					lineNumber: selection.endLineNumber,
					column: selection.endColumn,
				});
				const selectedTextLength = endOffset - startOffset;
				selectionSpanRef.current.textContent = ` (${selectedTextLength} selected)`;
			}
		},
		[],
	);

	const updateCursor = useCallback(
		(codeEditor: NonNullable<typeof instance>) => {
			if (!cursorSpanRef.current) return;
			const position = codeEditor.getPosition();
			if (!position) return;
			cursorSpanRef.current.textContent = `Ln ${position.lineNumber}, Col ${position.column}`;
		},
		[],
	);

	const onMount = useCallback(
		(codeEditor: NonNullable<typeof instance>) => {
			updateCursor(codeEditor);
			updateSelection(codeEditor);
		},
		[updateCursor, updateSelection],
	);

	// Effect to subscribe to cursor and selection changes
	useEffect(() => {
		if (!instance?.getModel()) return;

		onDidChangeCursorPositionRef.current =
			instance.onDidChangeCursorPosition(() => updateCursor(instance));

		onDidChangeModelRef.current = instance.onDidChangeModel(() => {
			updateCursor(instance);
			updateSelection(instance);
		});

		onDidChangeCursorSelectionRef.current =
			instance.onDidChangeCursorSelection(() =>
				updateSelection(instance),
			);

		return () => {
			onDidChangeCursorPositionRef.current?.dispose();
			onDidChangeModelRef.current?.dispose();
			onDidChangeCursorSelectionRef.current?.dispose();
		};
	}, [instance, updateCursor, updateSelection]);

	// Effect to update cursor and selection on mount
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
			ariaLabel="Go to Line/Column"
			onClick={handleNavigateToLine}
		>
			<span
				ref={cursorSpanRef}
				aria-live="polite"
				aria-atomic="true"
			>
				{INITIAL_CURSOR_POSITION}
			</span>
			<span
				ref={selectionSpanRef}
				aria-live="polite"
				aria-atomic="true"
			/>
		</EditorStatusBarItem>
	);
};
