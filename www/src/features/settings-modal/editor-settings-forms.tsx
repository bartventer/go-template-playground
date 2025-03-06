import {
	textModelDataFile,
	textModelTemplateFile,
} from "@components/editor/data";
import {
	useContextModelPreferencesAtomValue,
	useTemplateModelPreferencesAtomValue,
} from "@state";
import { ModelSettingsForm } from "./model-settings-form";

export const TemplateEditorSettingsForm: React.FC = () => {
	const value = useTemplateModelPreferencesAtomValue();
	return (
		<ModelSettingsForm
			path={textModelTemplateFile.path}
			value={value}
		/>
	);
};

export const ContextEditorSettingsForm: React.FC = () => {
	const value = useContextModelPreferencesAtomValue();
	return (
		<ModelSettingsForm
			path={textModelDataFile.path}
			value={value}
		/>
	);
};
