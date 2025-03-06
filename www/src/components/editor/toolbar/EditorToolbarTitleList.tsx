import { chakra } from "@chakra-ui/react";

export const EditorToolbarTitleList = chakra("div", {
	label: "EditorToolbarTitleList",
	baseStyle: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "nowrap",
		justifyContent: "flex-start",
		alignItems: "center",
		marginTop: "-1px",
		borderStartStartRadius: "sm",
	},
});
