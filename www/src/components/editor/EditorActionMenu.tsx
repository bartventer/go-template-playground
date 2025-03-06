import { Menu, MenuButton, MenuList, useDisclosure } from "@chakra-ui/react";
import { EllipsisIcon } from "@components/icons";
import { TooltipIconButton } from "@components/tooltip-icon-button";
import { useMonacoReadyAtomValue } from "@state";
import { useEditorApi } from "./editor-provider/hooks";
import {
	CopyToClipboardMenuItem,
	DownloadFileMenuItem,
	UploadFileMenuItem,
} from "./widget-elements";

export const EditorActionMenu: React.FC = () => {
	const file = useEditorApi().useActiveFile();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const isMonacoReady = useMonacoReadyAtomValue();

	if (!file) return null;
	return (
		<Menu
			isOpen={isOpen}
			onClose={onClose}
			closeOnSelect
		>
			<MenuButton
				as={TooltipIconButton}
				aria-label="Editor Actions"
				tooltipLabel="Editor Actions"
				icon={<EllipsisIcon />}
				onClick={onOpen}
				isActive={isOpen}
				disabled={!isMonacoReady}
			/>
			<MenuList>
				<CopyToClipboardMenuItem />
				<DownloadFileMenuItem path={file.path} />
				{!file.readOnly && <UploadFileMenuItem path={file.path} />}
			</MenuList>
		</Menu>
	);
};
