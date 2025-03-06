import { type IconProps, Icon } from "@chakra-ui/react";

export const InfoIcon: React.FC<IconProps> = (props) => (
	<Icon
		viewBox="0 0 12 12"
		fill="none"
		{...props}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			d="M6.426.773A5.1 5.1 0 0 1 9.57 2.287a5.295 5.295 0 0 1 .345 7.043 5.137 5.137 0 0 1-6.435 1.305A5.25 5.25 0 0 1 1.14 8.01a5.34 5.34 0 0 1-.172-3.533 5.25 5.25 0 0 1 2.077-2.842A5.1 5.1 0 0 1 6.426.773Zm.354 9.637a4.418 4.418 0 0 0 2.558-1.553 4.552 4.552 0 0 0-.3-6.045 4.365 4.365 0 0 0-5.573-.555 4.545 4.545 0 0 0 .375 7.718c.899.485 1.94.639 2.94.435ZM5.531 4.5h.938v-.75H5.53v.75Zm.938.75v3H5.53v-3h.938Z"
			clipRule="evenodd"
		/>
	</Icon>
);
