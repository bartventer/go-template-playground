import {
	useEditorAutoSavePreferenceAtomValue,
	useEditorContextmenuPreferenceAtom,
	useEditorCursorBlinkingPreferenceAtom,
	useEditorFullScreenPreferenceAtom,
	useEditorHighContrastPreferenceAtom,
	useEditorLineNumbersPreferenceAtom,
	useEditorMinimapPreferenceAtom,
	useEditorNormalizedThemeAtomValue,
	useEditorSmoothScrollingPreferenceAtom,
	useEditorTabCompletionPreferenceAtom,
	useEditorWordWrapPreferenceAtom,
	useIsSmallScreenAtomValue,
	useSetEditorThemePreferenceAtom,
	useToggleEditorAutoSavePreferenceAtom,
} from "@state";
import { CheckboxField, SelectField } from "../form-elements";
import {
	cursorBlinkingOptions,
	editorThemeOptions,
	lineNumbersOptions,
	tabCompletionOptions,
	wordWrapOptions,
} from "./options";

export const AutoSaveCheckbox = () => {
	const value = useEditorAutoSavePreferenceAtomValue();
	const toggle = useToggleEditorAutoSavePreferenceAtom();
	return (
		<CheckboxField
			label={"Auto save"}
			helperText="This will remember the last saved state of the editor"
			checked={value}
			onChange={toggle}
			name="autoSave"
		/>
	);
};

/**
 * Full screen checkbox field
 * @remarks
 * This field is disabled on small screens
 */
export const FullScreenCheckbox = () => {
	const [value, toggle] = useEditorFullScreenPreferenceAtom();
	const isSmallScreen = useIsSmallScreenAtomValue();
	return (
		<CheckboxField
			label="Full screen"
			helperText="Enable full screen mode"
			checked={isSmallScreen ? true : value}
			onChange={toggle}
			name="fullScreen"
			isDisabled={isSmallScreen}
		/>
	);
};

export const ThemeSelect = () => {
	const value = useEditorNormalizedThemeAtomValue();
	const setValue = useSetEditorThemePreferenceAtom();
	return (
		<SelectField
			label="Theme"
			helperText="Editor theme"
			value={value}
			onChange={(e) => setValue(e.target.value as typeof value)}
			name="theme"
		>
			{editorThemeOptions.map((option) => (
				<option
					key={option.value}
					value={option.value}
				>
					{option.label}
				</option>
			))}
		</SelectField>
	);
};

export const HighContrastCheckbox = () => {
	const [value, toggle] = useEditorHighContrastPreferenceAtom();
	return (
		<CheckboxField
			label="High contrast"
			helperText="Enable high contrast mode"
			checked={value}
			onChange={(e) => toggle(e.target.checked)}
			name="highContrast"
		/>
	);
};

export const SmoothScrollingCheckbox = () => {
	const [value, toggle] = useEditorSmoothScrollingPreferenceAtom();
	return (
		<CheckboxField
			label="Smooth scrolling"
			helperText="Enable smooth scrolling"
			checked={value}
			onChange={toggle}
			name="smoothScrolling"
		/>
	);
};

export const ContextMenuCheckbox = () => {
	const [value, toggle] = useEditorContextmenuPreferenceAtom();
	return (
		<CheckboxField
			label="Editor context menu"
			helperText="Show context menu (right-click menu)"
			checked={value}
			onChange={toggle}
			name="contextMenu"
		/>
	);
};

export const CursorBlinkingSelect = () => {
	const [value, setValue] = useEditorCursorBlinkingPreferenceAtom();
	return (
		<SelectField
			label="Cursor blinking"
			helperText="Cursor blinking style"
			value={value}
			onChange={(e) => setValue(e.target.value as typeof value)}
			name="cursorBlinking"
		>
			{cursorBlinkingOptions.map((option) => (
				<option
					key={option.value}
					value={option.value}
				>
					{option.label}
				</option>
			))}
		</SelectField>
	);
};

export const TabCompletionSelect = () => {
	const [value, setValue] = useEditorTabCompletionPreferenceAtom();
	return (
		<SelectField
			label="Tab completion"
			helperText="Tab completion style"
			value={value}
			onChange={(e) => setValue(e.target.value as typeof value)}
			name="tabCompletion"
		>
			{tabCompletionOptions.map((option) => (
				<option
					key={option.value}
					value={option.value}
				>
					{option.label}
				</option>
			))}
		</SelectField>
	);
};

export const WordWrapSelect = () => {
	const [value, setValue] = useEditorWordWrapPreferenceAtom();
	return (
		<SelectField
			label="Word wrap"
			helperText="Controls word wrapping"
			value={value}
			onChange={(e) => setValue(e.target.value as typeof value)}
			name="wordWrap"
		>
			{wordWrapOptions.map((option) => (
				<option
					key={option.value}
					value={option.value}
				>
					{option.label}
				</option>
			))}
		</SelectField>
	);
};

export const MinimapCheckbox = () => {
	const [value, setValue] = useEditorMinimapPreferenceAtom();
	const isSmallScreen = useIsSmallScreenAtomValue();
	return (
		<CheckboxField
			label="Minimap"
			helperText="Show minimap"
			onChange={(e) => setValue(e.target.checked)}
			name="minimap"
			checked={isSmallScreen ? false : value}
			isDisabled={isSmallScreen}
		/>
	);
};

export const LineNumbersSelect = () => {
	const [value, setValue] = useEditorLineNumbersPreferenceAtom();
	return (
		<SelectField
			label="Line numbers"
			helperText="Controls line numbers"
			value={value as string}
			onChange={(e) => setValue(e.target.value as typeof value)}
			name="lineNumbers"
		>
			{lineNumbersOptions.map((option) => (
				<option
					key={option.value}
					value={option.value}
				>
					{option.label}
				</option>
			))}
		</SelectField>
	);
};
