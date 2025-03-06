import { Heading } from "@chakra-ui/react";

export const EditorToolbarTitleText: React.FC<React.PropsWithChildren> = ({
	children,
}) => (
	<Heading
		as="h2"
		size="xs"
		fontWeight="medium"
	>
		{children}
	</Heading>
);
