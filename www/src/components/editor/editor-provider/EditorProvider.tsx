import type { OnMount } from "@monaco-editor/react";
import { useDisposableRef } from "@utils/hooks";
import { createStore } from "@utils/store";
import { editor } from "monaco-editor";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	type PropsWithChildren,
} from "react";
import type { TextModelFile } from "../data";
import {
	EditorApiContext,
	EditorMountContext,
	type EditorState,
	type EditorStateApi,
} from "./editor-context";

function noop(): void {}

export interface EditorProviderProps {
	/** Files for which to create models */
	files: readonly TextModelFile[];

	/**
	 * Callback to run when the editor is mounted.
	 *
	 * @remarks
	 * This callback is the last step in the editor setup process. It is called
	 * after the editor instance is created and all event listeners are set up.
	 */
	onMount?: OnMount;

	onChangeModelLanguage?: (
		e: editor.IModelLanguageChangedEvent,
		codeEditor: editor.ICodeEditor,
		monaco: typeof import("monaco-editor"),
	) => void;

	onChangeModelContent?: (
		e: editor.IModelContentChangedEvent,
		codeEditor: editor.IStandaloneCodeEditor,
		monaco: typeof import("monaco-editor"),
	) => void;

	onChangeModel?: (
		e: editor.IModelChangedEvent,
		codeEditor: editor.IStandaloneCodeEditor,
		monaco: typeof import("monaco-editor"),
	) => void;
}

/**
 * The `EditorProvider` component is a React functional component that provides
 * context for managing the state of a code editor. It uses a store to manage
 * the editor's instance, files, and file index. It also sets up event listeners
 * for changes in the model content and language, and provides an API for accessing
 * and manipulating the editor state.
 */
export const EditorProvider: React.FC<
	PropsWithChildren<EditorProviderProps>
> = ({ files, children, ...props }) => {
	const store = useRef(
		createStore<EditorState>({
			instance: null,
			files,
			fileIndex: 0,
		}),
	);
	const onDidChangeModelContentRef = useDisposableRef();
	const onDidChangeModelLanguageRef = useDisposableRef();
	const onDidChangeModelRef = useDisposableRef();

	useEffect(() => {
		store.current.setValue("files", files);
	}, [files]);

	useEffect(() => {
		return () => {
			onDidChangeModelContentRef.current?.dispose();
			onDidChangeModelLanguageRef.current?.dispose();
			onDidChangeModelRef.current?.dispose();
			store.current.setValue("instance", null);
		};
	}, [
		props.onMount,
		props.onChangeModelContent,
		props.onChangeModelLanguage,
		props.onChangeModel,
	]);

	const handleMount: OnMount = useCallback(
		(codeEditor, monaco) => {
			store.current.setValue("instance", codeEditor);
			if (props.onChangeModelContent) {
				onDidChangeModelContentRef.current =
					codeEditor.onDidChangeModelContent((e) => {
						props.onChangeModelContent?.(e, codeEditor, monaco);
					});
			}
			if (props.onChangeModelLanguage) {
				onDidChangeModelLanguageRef.current =
					codeEditor.onDidChangeModelLanguage((e) => {
						props.onChangeModelLanguage?.(e, codeEditor, monaco);
					});
			}
			if (props.onChangeModel) {
				onDidChangeModelRef.current = codeEditor.onDidChangeModel(
					(e) => {
						props.onChangeModel?.(e, codeEditor, monaco);
					},
				);
			}
			props.onMount?.(codeEditor, monaco);
		},
		[
			props.onMount,
			props.onChangeModelContent,
			props.onChangeModelLanguage,
			props.onChangeModel,
		],
	);

	const api = useMemo<EditorStateApi>(
		() => ({
			useInstance: () => store.current.useValue("instance", null),
			useFiles: () => store.current.getValue("files"), // No need to subscribe to changes,
			useFileIndex: () => store.current.useValue("fileIndex", 0),
			useSetFileIndex: () => (index) =>
				store.current.setValue("fileIndex", index),
			useSetFiles: () => noop, // No need to set files
			useSetInstance: () => noop, // No need to set instance
			useActiveFile() {
				const files = this.useFiles();
				const index = this.useFileIndex();
				return files[index] ?? null;
			},
		}),
		[],
	);

	return (
		<EditorApiContext.Provider value={api}>
			<EditorMountContext.Provider value={handleMount}>
				{children}
			</EditorMountContext.Provider>
		</EditorApiContext.Provider>
	);
};
