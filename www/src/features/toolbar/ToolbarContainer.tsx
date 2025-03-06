import { chakra } from "@chakra-ui/react";

export const ToolbarContainer = chakra("header", {
	label: "ToolbarContainer",
	baseStyle: {
		alignItems: "center",
		justifyContent: "space-between",
		display: "flex",
		flexWrap: "wrap",
	},
});
