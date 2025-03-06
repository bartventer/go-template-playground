import { HStack } from "@chakra-ui/react";
import type React from "react";

export const EditorStatusBarBeginItems: React.FC<React.PropsWithChildren> = ({
	children,
}) => (
	<HStack
		className="editor-status-bar-begin-items"
		flexGrow={1}
		height="100%"
		alignItems="center"
	>
		{children}
	</HStack>
);
