import { VStack } from "@chakra-ui/react";
import { CheckboxFieldSkeleton, SelectFieldSkeleton } from "../form-elements";

export const GeneralSettingsFormSkeleton = () => (
	<VStack spacing={3}>
		{/* Auto save */}
		<CheckboxFieldSkeleton />
		{/* Full screen */}
		<CheckboxFieldSkeleton />
		{/* Theme */}
		<SelectFieldSkeleton />
		{/* High contrast */}
		<CheckboxFieldSkeleton />
		{/* Smooth scrolling */}
		<CheckboxFieldSkeleton />
		{/* Context menu */}
		<CheckboxFieldSkeleton />
		{/* Cursor blinking */}
		<CheckboxFieldSkeleton />
		{/* Tab completion */}
		<SelectFieldSkeleton />
		{/* Word wrap */}
		<SelectFieldSkeleton />
		{/* Minimap */}
		<CheckboxFieldSkeleton />
		{/* Line numbers */}
		<SelectFieldSkeleton />
	</VStack>
);
