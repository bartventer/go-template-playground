import { HStack } from "@chakra-ui/react";
import type React from "react";

export const EditorStatusBarEndItems: React.FC<React.PropsWithChildren> = ({
	children,
}) => (
	<HStack
		className="editor-status-bar-end-items"
		height="100%"
		alignItems="center"
		justifyContent="flex-end"
	>
		{children}
	</HStack>
);
