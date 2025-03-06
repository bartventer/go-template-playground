import type { TextModelPreferencesState } from "@atoms";
import { VStack } from "@chakra-ui/react";
import type { TextModelFile } from "@components/editor/data";
import {
	IndentSizeInput,
	InsertSpacesCheckbox,
	TabSizeInput,
	TrimAutoWhitespaceCheckbox,
} from "./field-elements";

export interface ModelSettingsFormProps {
	path: TextModelFile["path"];
	value: TextModelPreferencesState;
}

export const ModelSettingsForm: React.FC<ModelSettingsFormProps> = ({
	path,
	value,
}) => {
	return (
		<VStack spacing={3}>
			<TrimAutoWhitespaceCheckbox
				path={path}
				atom={value.trimAutoWhitespace}
			/>
			<InsertSpacesCheckbox
				path={path}
				atom={value.insertSpaces}
			/>
			<TabSizeInput
				path={path}
				atom={value.tabSize}
				insertSpacesAtom={value.insertSpaces}
			/>
			<IndentSizeInput
				path={path}
				atom={value.indentSize}
				insertSpacesAtom={value.insertSpaces}
			/>
		</VStack>
	);
};
