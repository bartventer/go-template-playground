import { SettingsGearIcon } from "@components/icons";
import { TooltipIconButton } from "@components/tooltip-icon-button";
import {
	useOpenSettingsAtom,
	useSetEditorFileSettingsAtom,
} from "@features/settings-modal/atoms";
import { memo, useCallback } from "react";
import { useEditorApi } from "../editor-provider";

/** Action to open the editor settings, focusing on the current file */
export const EditorSettingsAction: React.FC = memo(() => {
	const setActiveFile = useSetEditorFileSettingsAtom();
	const openSettings = useOpenSettingsAtom();
	const editorApi = useEditorApi();
	const { path, readOnly, label } = editorApi.useActiveFile();

	const handleSettingsOpen = useCallback(() => {
		if (!path) return;
		setActiveFile(path);
		openSettings();
	}, [path, openSettings, setActiveFile]);

	if (readOnly) {
		return null;
	}

	return (
		<TooltipIconButton
			aria-label={`Open "${label}" settings`}
			tooltipLabel={`Open "${label}" settings`}
			tooltipProps={{ placement: "top-end" }}
			icon={<SettingsGearIcon />}
			onClick={handleSettingsOpen}
		/>
	);
});
