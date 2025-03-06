import { Icon, MenuItem } from "@chakra-ui/react";
import { GoUpload } from "react-icons/go";
import { useFileUpload, UseFileUploadProps } from "./hooks";

export const UploadFileMenuItem: React.FC<UseFileUploadProps> = ({ path }) => {
	const [onClickUpload] = useFileUpload({ path });
	return (
		<MenuItem
			icon={<Icon as={GoUpload} />}
			onClick={onClickUpload}
			disabled={false}
		>
			Upload File
		</MenuItem>
	);
};
