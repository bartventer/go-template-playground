import { Icon, MenuItem } from "@chakra-ui/react";
import { GoDownload } from "react-icons/go";
import { useFileDownload, UseFileDownloadProps } from "./hooks";

export const DownloadFileMenuItem: React.FC<UseFileDownloadProps> = ({
	path,
}) => {
	const [onClickDownload] = useFileDownload({ path });
	return (
		<MenuItem
			icon={<Icon as={GoDownload} />}
			onClick={onClickDownload}
		>
			Download File
		</MenuItem>
	);
};
