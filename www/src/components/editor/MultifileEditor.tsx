import { CloseButton, Show, Tab, TabList, Tabs } from "@chakra-ui/react";
import { TextFileIcon } from "@components/icons";
import { Editor } from "@monaco-editor/react";
import { useEditorThemePreferenceAtomValue } from "@state";
import type { editor } from "monaco-editor/esm/vs/editor/editor.api";
import React, {
	memo,
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { EditorSettingsAction, MarkdownPreviewAction } from "./action-items";
import {
	EditorProvider,
	useEditorApi,
	useEditorMount,
	type EditorProviderProps,
} from "./editor-provider";
import { EditorActionMenu } from "./EditorActionMenu";
import { EditorContentContainer } from "./EditorContentContainer";
import { EditorContentInner } from "./EditorContentInner";
import { EditorShell } from "./EditorShell";
import {
	useEditorAutofocusEffect,
	useEditorLanguageValidationEffect,
	useEditorThemeSyncEffect,
	useMarkdownViewerAction,
} from "./hooks";
import { MarkdownViewer } from "./markdown-viewer";
import "./MultifileEditor.css";
import {
	EditorStatusBar,
	EditorStatusBarBeginItems,
	EditorStatusBarEndItems,
} from "./status-bar";
import {
	EditorCursorStatusBarItem,
	EditorFeedbackStatusBarItem,
	EditorFormatCodeStatusBarItem,
	EditorIssuesStatusBarItem,
	EditorLanguageStatusBarItem,
} from "./status-bar-items";
import {
	EditorToolbarActionGroup,
	EditorToolbarContainer,
	EditorToolbarTitleList,
	EditorToolbarTitleText,
	EditorToolbarTitleWithScrollSnap,
} from "./toolbar";

const DEFAULT_ACTIVE_FILE_INDEX = 0;

interface CustomEditorProps {
	show?: boolean;
}

const CustomEditor: React.FC<CustomEditorProps> = memo(({ show }) => {
	const onMount = useEditorMount();
	const activeFile = useEditorApi().useActiveFile();
	const theme = useEditorThemePreferenceAtomValue(); // Important to prevent flashing

	useEditorLanguageValidationEffect();
	useEditorThemeSyncEffect();
	useEditorAutofocusEffect();

	const options = useMemo<editor.IStandaloneEditorConstructionOptions>(
		() => ({
			padding: { top: 10, bottom: 10 },
			readOnly: activeFile?.readOnly,
			detectIndentation: false,
			automaticLayout: true,
		}),
		[activeFile?.readOnly],
	);

	const wrapperProps = useMemo<React.HTMLAttributes<HTMLDivElement>>(
		() => ({
			...(show ? {} : { style: { display: "none" } }),
		}),
		[show],
	);

	return (
		<Editor
			className="playground-editor"
			defaultLanguage={activeFile?.defaultLanguage.id}
			defaultValue={activeFile?.defaultLanguage.defaultValue ?? ""}
			height="100%"
			theme={theme}
			options={options}
			onMount={onMount}
			keepCurrentModel
			path={activeFile?.path}
			wrapperProps={wrapperProps}
		/>
	);
});

/** Multifile editor with tabs */
const MultifileEditorComponent: React.FC = () => {
	const [tabIndex, setTabIndex] = useState<number>(DEFAULT_ACTIVE_FILE_INDEX);

	const editorApi = useEditorApi();
	const editorFiles = editorApi.useFiles();
	const editorFileIndex = editorApi.useFileIndex();
	const setEditorFileIndex = editorApi.useSetFileIndex();

	const mdViewerTabIndex = useMemo(
		() => editorFiles.length,
		[editorFiles.length],
	);
	const handleMdShow = useCallback(
		() => setTabIndex(mdViewerTabIndex),
		[mdViewerTabIndex],
	);
	const handleMdHide = useCallback(
		() => setTabIndex(editorFileIndex),
		[editorFileIndex],
	);
	const { isOpen: isMdViewerOpen, actions: mdViewerActions } =
		useMarkdownViewerAction({
			onShow: handleMdShow,
			onHide: handleMdHide,
		});

	const isMdViewerTabSelected = useMemo(
		() => tabIndex === mdViewerTabIndex,
		[tabIndex, mdViewerTabIndex],
	);

	// Effect to sync editor file index with tab index
	useEffect(() => {
		const syncEditorFileIndex = () => {
			if (tabIndex < mdViewerTabIndex) {
				setEditorFileIndex(tabIndex);
			}
		};
		syncEditorFileIndex();
	}, [tabIndex, mdViewerTabIndex]);

	return (
		<EditorShell
			className="editor-shell"
			as={Tabs}
			index={tabIndex}
			onChange={setTabIndex}
		>
			<EditorToolbarContainer>
				<EditorToolbarTitleList as={TabList}>
					{/* Editor tabs */}
					{editorFiles.map((editorFile, index) => (
						<EditorToolbarTitleWithScrollSnap
							as={Tab}
							key={index}
							aria-label={editorFile.label}
						>
							<TextFileIcon className="file-icon" />
							<EditorToolbarTitleText>
								{editorFile.label}
							</EditorToolbarTitleText>
						</EditorToolbarTitleWithScrollSnap>
					))}
					{/* Markdown preview tab */}
					{isMdViewerOpen && (
						<EditorToolbarTitleWithScrollSnap
							as={Tab}
							key={mdViewerTabIndex}
							aria-label="Preview Output"
						>
							<TextFileIcon className="file-icon" />
							<EditorToolbarTitleText>
								Preview Output
							</EditorToolbarTitleText>
							<CloseButton
								as="span"
								role="button"
								onClick={mdViewerActions.hide}
								aria-label="Close Markdown Preview"
								size="sm"
								fontSize={8}
								marginInlineStart={1.5}
								marginInlineEnd={-2}
								className="tab-close-button"
								height={4}
								width={4}
							/>
						</EditorToolbarTitleWithScrollSnap>
					)}
				</EditorToolbarTitleList>
				<EditorToolbarActionGroup>
					<Show above="md">
						<MarkdownPreviewAction
							show={!isMdViewerTabSelected}
							onToggle={mdViewerActions.show}
						/>
						<EditorSettingsAction />
					</Show>
					<EditorActionMenu />
				</EditorToolbarActionGroup>
			</EditorToolbarContainer>
			<EditorContentContainer>
				<EditorContentInner>
					<CustomEditor show={!isMdViewerTabSelected} />
					<Show above="md">
						<MarkdownViewer show={isMdViewerTabSelected} />
					</Show>
				</EditorContentInner>
			</EditorContentContainer>
			<EditorStatusBar>
				<EditorStatusBarBeginItems>
					<EditorIssuesStatusBarItem />
				</EditorStatusBarBeginItems>
				<EditorStatusBarEndItems>
					{!isMdViewerTabSelected && (
						<>
							<Show above="md">
								<EditorCursorStatusBarItem />
							</Show>
							<EditorLanguageStatusBarItem />
							<EditorFormatCodeStatusBarItem />
						</>
					)}
					<EditorFeedbackStatusBarItem />
				</EditorStatusBarEndItems>
			</EditorStatusBar>
		</EditorShell>
	);
};

export const MultifileEditor: React.FC<EditorProviderProps> = (props) => (
	<EditorProvider {...props}>
		<Suspense fallback={<div>Loading...</div>}>
			<MultifileEditorComponent />
		</Suspense>
	</EditorProvider>
);
