import { type IconProps, Icon } from "@chakra-ui/react";

export const WarningIcon: React.FC<IconProps> = (props) => (
	<Icon
		viewBox="0 0 12 11"
		{...props}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			d="M5.67.75h.66l4.905 9.195-.33.555H1.08l-.33-.555L5.67.75Zm.33.96L1.71 9.75h8.565L6 1.71ZM6.469 9v-.75H5.53V9h.938ZM5.53 7.5v-3h.938v3H5.53Z"
			clipRule="evenodd"
		/>
	</Icon>
);
