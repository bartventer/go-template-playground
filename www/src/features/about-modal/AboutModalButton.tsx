import { Button } from "@chakra-ui/react";
import { InfoIcon } from "@components/icons/InfoIcon";
import { useOpenAboutAtom } from "./atoms";
import { ABOUT_MODAL_LABEL } from "./constants";

export const AboutModalButton: React.FC = () => {
	const handleOpen = useOpenAboutAtom();
	return (
		<Button
			variant="ghost"
			onClick={handleOpen}
			leftIcon={<InfoIcon />}
		>
			{ABOUT_MODAL_LABEL}
		</Button>
	);
};
