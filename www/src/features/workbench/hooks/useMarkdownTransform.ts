import { textModelOutputFile } from "@components/editor/data";
import { CodeLanguages } from "@lib/monaco-editor/languages";
import type { Monaco } from "@monaco-editor/react";
import { MarkdownTransformer } from "@services/markdown";
import { useMonacoReadyAtomValue } from "@state";
import { editor, Uri } from "monaco-editor/esm/vs/editor/editor.api";
import { useCallback, useEffect, useRef } from "react";

interface UseMarkdownTransformerProps {
	encoder: React.MutableRefObject<TextEncoder>;
}

interface UseMarkdownTransformerReturn {
	/** Callback to transform the Markdown content */
	handleTransformMarkdown: (monaco?: Monaco) => void;
}

export function useMarkdownTransform({
	encoder,
}: UseMarkdownTransformerProps): UseMarkdownTransformerReturn {
	const isMonacoReady = useMonacoReadyAtomValue();
	const transformerRef = useRef<MarkdownTransformer | null>(null);
	const messagePortRef = useRef<MessagePort | null>(null);

	const handleTransformMarkdown: UseMarkdownTransformerReturn["handleTransformMarkdown"] =
		useCallback((monaco) => {
			const outputModel = (monaco?.editor || editor).getModel(
				Uri.parse(textModelOutputFile.path),
			);
			if (
				!outputModel ||
				!(outputModel.getLanguageId() === CodeLanguages.Markdown)
			)
				return;

			const outputView = encoder.current.encode(outputModel.getValue());
			transformerRef.current
				?.process(outputView)
				.then((result) => {
					const resultView =
						typeof result.value === "string"
							? encoder.current.encode(result.value)
							: result.value;
					messagePortRef.current?.postMessage(
						{
							action: "processed",
							value: resultView,
						} as Playground.editor.MarkdownTransformerResult,
						[resultView.buffer],
					);
				})
				.catch(console.error);
		}, []);

	const handleMarkdownReady = useCallback(
		(event: MessageEvent<Playground.editor.MarkdownTransformerReady>) => {
			if (event.data.action === "ready" && event.ports.length) {
				messagePortRef.current = event.ports[0];
				handleTransformMarkdown();
			}
		},
		[handleTransformMarkdown],
	);

	useEffect(() => {
		if (isMonacoReady) {
			transformerRef.current = new MarkdownTransformer();
			document.defaultView?.addEventListener(
				"message",
				handleMarkdownReady,
			);
		}

		return () => {
			transformerRef.current = null;
			document.defaultView?.removeEventListener(
				"message",
				handleMarkdownReady,
			);
			messagePortRef.current = null;
		};
	}, [isMonacoReady, handleMarkdownReady]);

	return { handleTransformMarkdown };
}
