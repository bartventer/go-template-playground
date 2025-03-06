import { release } from "package.json";
import rehypeFormat from "rehype-format";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkGithub, {
	type Options as RemarkGithubOptions,
} from "remark-github";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { VFile } from "vfile";

export interface ProcessorOptions {
	release?: typeof release;
}

const createProcessorInstance = (options: Required<ProcessorOptions>) =>
	unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkGithub, {
			repository: `${options.release.owner}/${options.release.repo}`,
		} as RemarkGithubOptions)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(rehypeFormat)
		.use(rehypeSanitize)
		.use(rehypeStringify);

type ProcessorInstance = ReturnType<typeof createProcessorInstance>;

/**
 * The `MarkdownTransformer` class is responsible for transforming markdown content
 * using a specified processor instance.
 */
export class MarkdownTransformer {
	#processor: ProcessorInstance;
	#options: Required<ProcessorOptions> = {
		release: release,
	};

	constructor(options?: ProcessorOptions) {
		this.#options = { ...this.#options, ...options };
		this.#processor = createProcessorInstance(this.#options);
	}

	/**
	 * Processes the given markdown content.
	 */
	async process(value: string | Uint8Array): Promise<VFile> {
		return this.#processor.process(value);
	}
}
