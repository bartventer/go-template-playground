import { chakra } from "@chakra-ui/react";

/** Wrapper for the toolbar, editor content, and status bar */
export const EditorShell = chakra("div", {
	label: "EditorShell",
	baseStyle: {
		display: "flex",
		flexDirection: "column",
		height: "full",
		minHeight: 200,
		minWidth: "100%",
		maxWidth: "100%",
		boxShadow: "lg",
		borderRadius: { base: "none", lg: "sm" },
	},
});
