import { type IconProps, Icon } from "@chakra-ui/react";

export const TextFileIcon: React.FC<IconProps> = (props) => (
	<Icon
		viewBox="0 0 12 12"
		{...props}
	>
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			fill="none"
			d="M7 1H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4L7 1Z"
		/>
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			fill="none"
			d="M7 1v3h3"
		/>
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			fill="none"
			d="M8 6.5H4"
		/>
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			fill="none"
			d="M8 8.5H4"
		/>
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			fill="none"
			d="M5 4.5H4"
		/>
	</Icon>
);
