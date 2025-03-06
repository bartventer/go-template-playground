import { type IconProps, Icon } from "@chakra-ui/react";

export const EllipsisIcon: React.FC<IconProps> = (props) => (
	<Icon
		viewBox="0 0 10 2"
		{...props}
	>
		<path
			fill="currentColor"
			d="M2 1A.75.75 0 1 1 .5 1 .75.75 0 0 1 2 1Zm3.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.5 1A.75.75 0 1 1 8 1a.75.75 0 0 1 1.5 0Z"
		/>
	</Icon>
);
