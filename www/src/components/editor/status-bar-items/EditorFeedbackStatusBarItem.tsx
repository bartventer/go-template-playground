import { VisuallyHidden } from "@chakra-ui/react";
import { FeedbackIcon } from "@components/icons";
import React, { memo, useCallback } from "react";
import { EditorStatusBarItem } from ".";
import { bugs } from "package.json";

/**
 * `EditorFeedbackStatusBarItem` is a React functional component that provides a status bar item
 * for sending feedback on the editor.
 */
export const EditorFeedbackStatusBarItem: React.FC = memo(() => {
	const handleSendFeedback = useCallback(() => {
		window.open(bugs, "_blank");
	}, []);
	return (
		<EditorStatusBarItem
			ariaLabel="Send feedback"
			aria-describedby="send-feedback"
			onClick={handleSendFeedback}
		>
			<VisuallyHidden>Click to send feedback</VisuallyHidden>
			<FeedbackIcon />
		</EditorStatusBarItem>
	);
});
