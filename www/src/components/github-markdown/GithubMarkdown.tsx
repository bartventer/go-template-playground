import { release } from "package.json";
import { forwardRef } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import type { Options as RemarkGithubOptions } from "remark-github";
import remarkGithub from "remark-github";
import "./GithubMarkdown.css";

export interface GithubMarkdownProps {
	/** The raw markdown content to render. */
	content: string;
	/** Owner and name of the repository to link against. */
	repository?: Playground.types.Omitted<typeof release, "repositoryUrl">;
	/** Additional CSS styles to apply to the outer container. */
	style?: React.CSSProperties;
}

/**
 * Component to render GitHub flavored markdown content.
 *
 * @example
 * // Example usage of GithubMarkdown component
 * <GithubMarkdown
 * 		repo={{ owner: "facebook", name: "react" }}
 * 		content={`
 * 			## Changelog
 * 			### Bug Fixes
 * 			* e1b3b3d: Fix a bug in the component (fixes #123)
 * 		`}
 * />
 */
export const GithubMarkdown: React.FC<GithubMarkdownProps> = forwardRef<
	HTMLDivElement,
	GithubMarkdownProps
>(
	(
		{
			content,
			repository = {
				owner: release.owner,
				name: release.repo,
			},
			style,
		},
		ref,
	) => (
		<div
			ref={ref}
			className="markdown-content"
			style={style}
		>
			<Markdown
				rehypePlugins={[rehypeRaw]}
				remarkPlugins={[
					remarkGfm,
					[
						remarkGithub,
						{
							repository: `${repository.owner}/${repository.repo}`,
						} satisfies RemarkGithubOptions,
					],
				]}
			>
				{content}
			</Markdown>
		</div>
	),
);
