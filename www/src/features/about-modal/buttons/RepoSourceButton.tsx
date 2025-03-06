import { Icon } from "@chakra-ui/react";
import { LinkButton } from "@components/link-button";
import { release } from "package.json";
import { VscGithubInverted } from "react-icons/vsc";

export const RepoSourceButton: React.FC = () => (
	<LinkButton
		linkProps={{
			href: release.repositoryUrl,
			isExternal: true,
		}}
		leftIcon={<Icon as={VscGithubInverted} />}
		variant="outline"
		size="sm"
	>
		Source
	</LinkButton>
);
