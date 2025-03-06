import { HStack } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

/** A flex container for toolbar items on the left side; will fill available space */
export const ToolbarLeft: React.FC<PropsWithChildren> = ({ children }) => (
	<HStack
		className="toolbar-left"
		spacing={2}
		flex={1}
		justifyContent="flex-start"
	>
		{children}
	</HStack>
);
