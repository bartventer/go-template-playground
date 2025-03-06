import { useTextModelPreferencesListener } from "@state";

/**
 * Effect to listen for text model preferences changes and update the Monaco editor.
 * This effect is intended to be run at the root of each text model editor.
 */
export const TextModelPreferencesEffect: React.FC = () => {
	useTextModelPreferencesListener();
	return null;
};
