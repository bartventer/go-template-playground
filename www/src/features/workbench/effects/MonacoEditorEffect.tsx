import { useEditorPreferencesListener, useMonacoReadyEffect } from "@state";

/**
 * Effect to listen for editor preferences changes and update the Monaco editor.
 * This effect is intended to be used at the root of the application.
 */
export const MonacoEditorEffect: React.FC = () => {
	useMonacoReadyEffect();
	useEditorPreferencesListener();
	return null;
};
