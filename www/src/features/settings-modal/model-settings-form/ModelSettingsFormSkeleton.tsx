import { VStack } from "@chakra-ui/react";
import { CheckboxFieldSkeleton, SelectFieldSkeleton } from "../form-elements";

export const ModelSettingsFormSkeleton: React.FC = () => (
	<VStack spacing={3}>
		{/* TrimAutoWhitespaceCheckbox */}
		<CheckboxFieldSkeleton />
		{/* InsertSpacesCheckbox */}
		<CheckboxFieldSkeleton />
		{/* TabSizeInput */}
		<SelectFieldSkeleton />
		{/* IndentSizeInput */}
		<SelectFieldSkeleton />
	</VStack>
);
