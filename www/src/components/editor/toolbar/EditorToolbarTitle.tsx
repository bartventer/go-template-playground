import { chakra } from "@chakra-ui/react";

export const EditorToolbarTitle = chakra("div", {
	label: "EditorToolbarTitle",
	baseStyle: {
		display: "flex",
		alignItems: "center",
		flexShrink: 0,
		minWidth: "fit-content",
		width: "auto",
	},
});
