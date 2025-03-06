import { IconButton } from "@chakra-ui/react";

export const TooltipIconButtonSkeleton: React.FC = () => (
	<IconButton
		isLoading
		isDisabled
		aria-label="Loading"
	/>
);
