import { Icon, MenuItem } from "@chakra-ui/react";
import { VscCopy } from "react-icons/vsc";
import { useCopyToClipboard } from "./hooks";

export const CopyToClipboardMenuItem: React.FC = () => {
	const [handleClick] = useCopyToClipboard();
	return (
		<MenuItem
			icon={<Icon as={VscCopy} />}
			onClick={handleClick}
		>
			Copy to Clipboard
		</MenuItem>
	);
};
