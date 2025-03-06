import { Button } from "@chakra-ui/react";
import { SettingsGearIcon } from "@components/icons";
import { useOpenDefaultSettingsAtom } from "./atoms";
import { SETTINGS_MODAL_LABEL } from "./constants";

export const SettingsModalButton: React.FC = () => {
	const handleOpen = useOpenDefaultSettingsAtom();
	return (
		<Button
			variant="ghost"
			onClick={handleOpen}
			leftIcon={<SettingsGearIcon />}
		>
			{SETTINGS_MODAL_LABEL}
		</Button>
	);
};
