import { Button } from "@chakra-ui/react";
import { SETTINGS_MODAL_LABEL } from "./constants";

export const SettingsModalButtonSkeleton: React.FC = () => (
	<Button
		isLoading
		loadingText={SETTINGS_MODAL_LABEL}
	/>
);
