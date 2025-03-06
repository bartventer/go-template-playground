import { GridItem } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import type { ContentArea } from "./constants";

interface ContentItemProps {
	area: ContentArea;
}
/**
 * A functional component that renders a grid item with a specified grid area and children.
 */
export const ContentItem: React.FC<PropsWithChildren<ContentItemProps>> = ({
	area,
	children,
}) => (
	<GridItem
		gridArea={area}
		className="content-item"
		sx={{
			transition: "opacity 0.3s",
		}}
	>
		{children}
	</GridItem>
);
