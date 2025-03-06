import { Button } from "@chakra-ui/react";
import { ABOUT_MODAL_LABEL } from "./constants";

export const AboutModalButtonSkeleton: React.FC = () => (
	<Button
		isLoading
		loadingText={ABOUT_MODAL_LABEL}
	/>
);
