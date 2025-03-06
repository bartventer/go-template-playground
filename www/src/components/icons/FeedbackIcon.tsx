import { type IconProps, Icon } from "@chakra-ui/react";

export const FeedbackIcon: React.FC<IconProps> = (props) => (
	<Icon
		viewBox="0 0 12 12"
		{...props}
	>
		<path
			fill="currentColor"
			d="M3.375.75 3 1.125v1.146a3.412 3.412 0 0 1 .75 0V1.5h6.75v3.75H9.22l-.97.97v-.97H6.73a3.412 3.412 0 0 1 0 .75h.77v1.125l.64.265L9.53 6h1.345l.375-.375v-4.5L10.875.75h-7.5Z"
		/>
		<path
			fill="currentColor"
			fillRule="evenodd"
			d="M4.813 7.822a2.625 2.625 0 1 0-2.876 0A3.376 3.376 0 0 0 0 10.875v.375h.75v-.375A2.627 2.627 0 0 1 5.23 9.019a2.626 2.626 0 0 1 .77 1.856L6 11.25h.75v-.375a3.375 3.375 0 0 0-1.937-3.053ZM3.375 7.5a1.875 1.875 0 1 1 0-3.75 1.875 1.875 0 0 1 0 3.75Z"
			clipRule="evenodd"
		/>
	</Icon>
);
