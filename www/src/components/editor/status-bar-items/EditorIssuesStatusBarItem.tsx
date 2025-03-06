import { VisuallyHidden } from "@chakra-ui/react";
import { ErrorIcon, WarningIcon } from "@components/icons";
import { useDisposableRef } from "@utils/hooks";
import {
	editor,
	MarkerSeverity,
	Uri,
} from "monaco-editor/esm/vs/editor/editor.api";
import React, {
	memo,
	startTransition,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { EditorAction } from "../constants";
import { useEditorAction } from "../hooks";
import { useEditorInstance } from "../editor-provider";
import { EditorStatusBarItem } from "./EditorStatusBarItem";

type FileIssueMetrics = {
	errorCount: number;
	warningCount: number;
};

/**
 * `EditorIssuesStatusBarItem` is a React functional component that displays the number of errors and warnings
 * in the current file being edited. It provides a status bar item that, when clicked, navigates to the next issue
 * in the editor.
 */
export const EditorIssuesStatusBarItem: React.FC = memo(() => {
	const [currentFile, setCurrentFile] = useState<Uri | null>(null);
	// Issues pertaining to each file/uri of the current editor
	const [editorFileIssues, setEditorFileIssues] = useState(
		new Map<string, FileIssueMetrics>(),
	);
	const instance = useEditorInstance();
	const onDidChangeModelRef = useDisposableRef();
	const onDidChangeMarkersRef = useDisposableRef();
	const isMounted = useRef(false);

	const currentFileIssues = editorFileIssues.get(
		currentFile?.toString() ?? "",
	);

	const navigateToNextMarker = useEditorAction(
		instance,
		EditorAction.NavigateToNextMarker,
	);

	const handleNavigateToNextMarker = useCallback(() => {
		if (
			!currentFileIssues ||
			currentFileIssues.errorCount + currentFileIssues.warningCount === 0
		) {
			return;
		}
		navigateToNextMarker();
		instance?.focus();
	}, [currentFileIssues, instance, navigateToNextMarker]);

	const updateIssues = useCallback((uri: Uri) => {
		const markers = editor.getModelMarkers({
			resource: uri,
		});
		startTransition(() => {
			setEditorFileIssues((prev) => {
				const nextIssues = new Map(prev);
				const nextFileIssues = markers.reduce(
					(acc, m) => {
						switch (m.severity) {
							case MarkerSeverity.Error:
								acc.errorCount++;
								break;
							case MarkerSeverity.Warning:
								acc.warningCount++;
								break;
						}
						return acc;
					},
					{ errorCount: 0, warningCount: 0 } as NonNullable<
						typeof currentFileIssues
					>,
				);
				nextIssues.set(uri.toString(), nextFileIssues);
				return nextIssues;
			});
		});
	}, []);

	const onMount = useCallback(
		(codeEditor: NonNullable<typeof instance>) => {
			const uri = codeEditor.getModel()?.uri;
			if (!uri) return;
			updateIssues(uri);
			setCurrentFile(uri);
		},
		[updateIssues],
	);

	// Effect to subscribe to model and marker changes
	useEffect(() => {
		if (!instance?.getModel()) return;
		onDidChangeModelRef.current = instance.onDidChangeModel((e) => {
			if (!e.newModelUrl) return;
			updateIssues(e.newModelUrl);
			setCurrentFile(e.newModelUrl);
		});
		onDidChangeMarkersRef.current = editor.onDidChangeMarkers((e) => {
			for (const uri of e) {
				updateIssues(uri);
			}
		});

		return () => {
			onDidChangeModelRef.current?.dispose();
			onDidChangeMarkersRef.current?.dispose();
		};
	}, [instance, updateIssues]);

	// Effect to run on mount
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
			onClick={handleNavigateToNextMarker}
			ariaLabel={createAriaLabel(currentFileIssues)}
		>
			<VisuallyHidden>Problems</VisuallyHidden>
			<ErrorIcon />
			{currentFileIssues?.errorCount ?? 0}
			<WarningIcon />
			{currentFileIssues?.warningCount ?? 0}
		</EditorStatusBarItem>
	);
});

function createAriaLabel(fileIssues?: FileIssueMetrics): string {
	if (!fileIssues) {
		return "No Problems";
	}

	const { errorCount, warningCount } = fileIssues;
	const parts = [];

	if (errorCount) {
		parts.push(`Errors: ${errorCount}`);
	}
	if (warningCount) {
		parts.push(`Warnings: ${warningCount}`);
	}

	return parts.length > 0
		? `${parts.join(". ")}. Go to next issue`
		: "No Problems";
}
