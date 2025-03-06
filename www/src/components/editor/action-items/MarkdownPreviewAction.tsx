import { OpenPreviewIcon } from "@components/icons";
import { TooltipIconButton } from "@components/tooltip-icon-button";
import { memo, useMemo } from "react";
import { useIsMarkdownViewerSupported } from "../hooks";
import { withActiveFile } from "../status-bar-items/withEditableFileOnly";

interface MarkdownPreviewActionProps {
	show?: boolean;
	onToggle?: () => void;
}

export const MarkdownPreviewAction: React.FC<MarkdownPreviewActionProps> = memo(
	withActiveFile(({ show, onToggle, file }) => {
		const supported = useIsMarkdownViewerSupported();
		const visible = useMemo(
			() => show && supported.has(file.path),
			[show, supported, file.path],
		);
		return (
			<TooltipIconButton
				aria-label="Open preview"
				tooltipLabel="Open preview"
				icon={<OpenPreviewIcon />}
				visibility={visible ? "visible" : "hidden"}
				opacity={visible ? 1 : 0}
				transition="visibility 0.2s, opacity 0.2s"
				onClick={onToggle}
			/>
		);
	}),
);
