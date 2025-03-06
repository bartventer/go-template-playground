import type { OnMount } from "@monaco-editor/react";
import { type StoreApi } from "@utils/store";
import { editor } from "monaco-editor";
import { createContext } from "react";
import type { TextModelFile } from "../data";

export interface EditorState {
	instance: editor.IStandaloneCodeEditor | null;
	files: readonly TextModelFile[];
	fileIndex: number;
}

export interface EditorStateApi extends StoreApi<EditorState> {
	useActiveFile: () => TextModelFile | null;
}

export const EditorApiContext = createContext<EditorStateApi | null>(null);
export const EditorMountContext = createContext<OnMount | null>(null);
