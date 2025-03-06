import { ButtonGroup, HStack } from "@chakra-ui/react";

export const EditorToolbarActionGroup: React.FC<React.PropsWithChildren> = ({
	children,
}) => (
	<HStack
		as={ButtonGroup}
		size="xs"
		spacing={0.25}
		variant="ghost"
		marginInline={1}
		colorScheme="gray"
	>
		{children}
	</HStack>
);
