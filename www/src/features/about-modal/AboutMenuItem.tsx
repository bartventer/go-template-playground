import { MenuItem } from "@chakra-ui/react";
import { InfoIcon } from "@components/icons";
import { useOpenAboutAtom } from "./atoms";
import { ABOUT_MODAL_LABEL } from "./constants";

export const AboutMenuItem: React.FC = () => {
	const handleOpen = useOpenAboutAtom();
	return (
		<MenuItem
			onClick={handleOpen}
			icon={<InfoIcon />}
		>
			{ABOUT_MODAL_LABEL}
		</MenuItem>
	);
};
