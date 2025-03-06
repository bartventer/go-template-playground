import { Box } from "@chakra-ui/react";
import "./MarkdownViewer.css";
import { useMarkdownViewerRef } from "./useMarkdownViewerRef";

interface MarkdownViewerProps {
	show?: boolean;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ show }) => {
	const elementRef = useMarkdownViewerRef({ show });
	return (
		<Box
			className="monaco-editor markdown-viewer-container"
			role="region"
			style={{
				display: show ? "block" : "none",
				height: "100%",
				textAlign: "initial",
				overflowY: "hidden",
				outlineWidth: 0,
			}}
		>
			<div
				ref={elementRef}
				className="markdown-body"
				aria-label="Markdown preview"
				area-live="polite"
				role="region"
				aria-hidden={!show}
				style={{
					height: "100%",
					overflowY: "auto",
					paddingInline: "2.5rem",
					visibility: show ? "visible" : "hidden",
				}}
			></div>
		</Box>
	);
};
