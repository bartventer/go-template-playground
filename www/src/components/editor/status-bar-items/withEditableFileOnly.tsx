import type { ExtractApiState } from "@utils/store";
import { useEditorApi } from "../editor-provider";

interface WithEditorApiProps {
	editorApi: ReturnType<typeof useEditorApi>;
}

/**
 * Higher-Order Component to conditionally render a component based on the read-only status.
 *
 * @param Component - The component to wrap.
 * @returns A new component that conditionally renders the wrapped component.
 */
export function withEditableFileOnly<P = {}>(
	Component: React.ComponentType<P & WithEditorApiProps>,
): React.FC<P> {
	return (props: P) => {
		const editorApi = useEditorApi();
		const isReadOnly = editorApi.useActiveFile()?.readOnly;

		if (isReadOnly) return null;

		return (
			<Component
				{...props}
				editorApi={editorApi}
			/>
		);
	};
}

interface WithActiveFileProps extends WithEditorApiProps {
	file: NonNullable<
		ExtractApiState<ReturnType<typeof useEditorApi>>["activeFile"]
	>;
}

/**
 * Higher-Order Component to conditionally render a component based on whether an active file exists.
 *
 * @param Component - The component to wrap.
 * @returns A new component that conditionally renders the wrapped component.
 */
export function withActiveFile<P = {}>(
	Component: React.ComponentType<P & WithActiveFileProps>,
): React.FC<P> {
	return (props: P) => {
		const editorApi = useEditorApi();
		const file = editorApi.useActiveFile();

		if (!file) return null;

		return (
			<Component
				{...props}
				editorApi={editorApi}
				file={file}
			/>
		);
	};
}
