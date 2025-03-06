import { Flex } from "@chakra-ui/react";

export const EditorToolbarContainer: React.FC<React.PropsWithChildren> = ({
	children,
}) => (
	<Flex
		className={"editor-toolbar-container"}
		justifyContent="space-between"
		alignItems="center"
		flexDirection="row"
	>
		{children}
	</Flex>
);
