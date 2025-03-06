import { MenuItem } from "@chakra-ui/react";
import { SettingsGearIcon } from "@components/icons";
import { useOpenSettingsAtom } from "./atoms";
import { SETTINGS_MODAL_LABEL } from "./constants";

export const SettingsMenuItem: React.FC = () => {
	const handleOpen = useOpenSettingsAtom();
	return (
		<MenuItem
			onClick={handleOpen}
			icon={<SettingsGearIcon />}
		>
			{SETTINGS_MODAL_LABEL}
		</MenuItem>
	);
};
