import { Link, Text } from "@chakra-ui/react";
import { author } from "package.json";

export const FooterContent: React.FC = () => (
	<Text
		fontSize="x-small"
		color="chakra-subtle-text"
	>
		Copyright &copy; {new Date().getFullYear()}
		{` `}
		<Link
			href={author.url}
			isExternal
		>
			{author.name}
		</Link>
	</Text>
);
