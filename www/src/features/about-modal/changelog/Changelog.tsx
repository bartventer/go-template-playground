import { GithubMarkdown } from "@components/github-markdown";
import { useChangelogAtomValue } from "./atoms";

export const Changelog: React.FC = () => {
	const content = useChangelogAtomValue();
	return <GithubMarkdown content={content} />;
};
