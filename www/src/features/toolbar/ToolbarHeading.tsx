import { Heading, Text, VStack } from "@chakra-ui/react";
import { description, displayName } from "package.json";

/** ToolbarHeading renders the heading and subheading of the toolbar. */
export const ToolbarHeading: React.FC = () => (
	<VStack
		className="toolbar-heading"
		spacing={1}
		padding={1}
		align="flex-start"
		flex="1"
		textAlign="left"
		display={{ base: "none", md: "block" }}
	>
		{/* Heading */}
		<Heading
			className="toolbar-heading-text"
			as="h1"
			size="md"
		>
			{displayName}
		</Heading>
		{/* Subheading */}
		<Text
			className="toolbar-subheading-text"
			fontSize="sm"
			_light={{ color: "gray.600" }}
			_dark={{ color: "gray.400" }}
		>
			{description}
		</Text>
	</VStack>
);
