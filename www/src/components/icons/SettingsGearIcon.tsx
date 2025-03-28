import { type IconProps, Icon } from "@chakra-ui/react";

export const SettingsGearIcon: React.FC<IconProps> = (props) => (
	<Icon
		viewBox="0 0 12 12"
		{...props}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			d="M9.925 4.375 12 4.79v2.42l-2.075.415 1.175 1.76L9.385 11.1l-1.76-1.175L7.21 12H4.79l-.415-2.075-1.76 1.175L.9 9.385l1.175-1.76L0 7.21V4.79l2.075-.415L.9 2.615 2.615.9l1.76 1.175L4.79 0h2.42l.415 2.075L9.385.9 11.1 2.615l-1.175 1.76ZM9.14 6.91l2-.405v-1l-2-.405-.27-.65 1.145-1.715L9.3 2.02 7.585 3.165l-.65-.27-.405-2h-1l-.405 2-.65.27L2.76 2.02l-.715.715L3.19 4.45l-.27.65-2 .405v1l2 .405.27.65-1.145 1.715.715.715 1.715-1.145.65.27.405 2h1l.405-2 .65-.27L9.3 9.99l.715-.715L8.87 7.56l.27-.65ZM5.047 4.574a1.715 1.715 0 1 1 1.906 2.852 1.715 1.715 0 0 1-1.906-2.852Zm.478 2.137a.854.854 0 1 0 .95-1.42.854.854 0 0 0-.95 1.42Z"
			clipRule="evenodd"
		/>
	</Icon>
);
