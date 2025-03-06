import { VStack } from "@chakra-ui/react";
import {
	AutoSaveCheckbox,
	ContextMenuCheckbox,
	CursorBlinkingSelect,
	FullScreenCheckbox,
	HighContrastCheckbox,
	LineNumbersSelect,
	MinimapCheckbox,
	SmoothScrollingCheckbox,
	TabCompletionSelect,
	ThemeSelect,
	WordWrapSelect,
} from "./field-elements";

export const GeneralSettingsForm = () => {
	return (
		<VStack spacing={3}>
			<AutoSaveCheckbox />
			<FullScreenCheckbox />
			<ThemeSelect />
			<HighContrastCheckbox />
			<SmoothScrollingCheckbox />
			<ContextMenuCheckbox />
			<CursorBlinkingSelect />
			<TabCompletionSelect />
			<WordWrapSelect />
			<MinimapCheckbox />
			<LineNumbersSelect />
		</VStack>
	);
};
