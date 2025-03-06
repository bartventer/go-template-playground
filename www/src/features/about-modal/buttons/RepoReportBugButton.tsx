import { Icon } from "@chakra-ui/react";
import { VscBug } from "react-icons/vsc";
import { LinkButton } from "@components/link-button";
import { bugs } from "package.json";

export const RepoReportBugButton: React.FC = () => (
	<LinkButton
		linkProps={{
			href: bugs,
			isExternal: true,
		}}
		leftIcon={<Icon as={VscBug} />}
		variant="outline"
		size="sm"
		colorScheme="purple"
	>
		Report Bug
	</LinkButton>
);
