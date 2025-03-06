import { useContext } from "react";
import {
	type EditorStateApi,
	EditorApiContext,
	EditorMountContext,
} from "./editor-context";

export function useEditorApi(): EditorStateApi {
	const context = useContext(EditorApiContext);
	if (!context) {
		throw new Error("useEditorApi must be used within an EditorProvider");
	}
	return context;
}

export function useEditorMount() {
	const context = useContext(EditorMountContext);
	if (!context) {
		throw new Error("useEditorMount must be used within an EditorProvider");
	}
	return context;
}

export function useEditorInstance() {
	const api = useEditorApi();
	return api.useInstance();
}
