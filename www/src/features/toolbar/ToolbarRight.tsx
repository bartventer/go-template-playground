import { ButtonGroup } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

/** A button group for toolbar buttons on the right side */
export const ToolbarRight: React.FC<PropsWithChildren> = ({ children }) => (
	<ButtonGroup
		className="toolbar-right"
		size="xs"
		variant="ghost"
		sx={{
			"svg[class*='icon']": {
				height: "1rem",
				width: "1rem",
			},
		}}
	>
		{children}
	</ButtonGroup>
);
