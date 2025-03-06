import { VisuallyHidden } from "@chakra-ui/react";
import { SymbolNamespaceIcon } from "@components/icons";
import { EditorStatusBarItem } from ".";
import { EditorAction } from "../constants";
import { useEditorAction } from "../hooks";
import { withEditableFileOnly } from "./withEditableFileOnly";

/**
 * Editor format code status bar item component.
 *
 * @remarks
 * Only visible when an editable file is open in the editor.
 */
export const EditorFormatCodeStatusBarItem = withEditableFileOnly(
	({ editorApi }) => {
		const instance = editorApi.useInstance();
		const handleFormatCode = useEditorAction(
			instance,
			EditorAction.FormatDocument,
		);
		return (
			<EditorStatusBarItem
				ariaLabel="Format code"
				aria-describedby="format-code"
				onClick={handleFormatCode}
			>
				<VisuallyHidden>Click to format code</VisuallyHidden>
				<SymbolNamespaceIcon />
			</EditorStatusBarItem>
		);
	},
);
