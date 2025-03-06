import { Flex } from "@chakra-ui/react";
import type React from "react";

export const EditorStatusBar: React.FC<React.PropsWithChildren> = ({
	children,
}) => (
	<Flex
		className="editor-status-bar"
		justifyContent="space-between"
		alignItems="center"
		paddingInline={1}
		flexDirection="row"
		backgroundColor="var(--vscode-tablist-background)"
		height="22px"
		borderBlockStart="1px solid"
		borderBlockStartColor="chakra-border-color"
	>
		{children}
	</Flex>
);
