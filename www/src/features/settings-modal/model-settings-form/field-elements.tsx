import type { TextModelPreferencesState } from "@atoms";
import { useAtom, useAtomValue, type Atom, type ExtractAtomValue } from "jotai";
import { useMemo } from "react";
import { CheckboxField, NumberInputField } from "../form-elements";

const MIN_INDENT_SIZE = 1;
const MAX_INDENT_SIZE = 6;

interface TextModelFieldProps<K extends keyof TextModelPreferencesState>
	extends Playground.editor.PropsWithModelPath {
	/** Writeable atom for the editor preference */
	atom: TextModelPreferencesState[K];
}

type WithInsertSpaceAtomProps<T extends object> = {
	insertSpacesAtom: Atom<
		ExtractAtomValue<TextModelPreferencesState["insertSpaces"]>
	>;
} & T;

export const TrimAutoWhitespaceCheckbox: React.FC<
	TextModelFieldProps<"trimAutoWhitespace">
> = ({ path, atom }) => {
	const [value, setValue] = useAtom(atom);
	const fieldName = useModelPathWithSuffix({
		path,
		suffix: "trimAutoWhitespace",
	});
	return (
		<CheckboxField
			label="Trim auto whitespace"
			helperText="Trim whitespace automatically"
			name={fieldName}
			checked={value}
			onChange={(e) => setValue(e.target.checked)}
		/>
	);
};

export const InsertSpacesCheckbox: React.FC<
	TextModelFieldProps<"insertSpaces">
> = ({ path, atom }) => {
	const [value, setValue] = useAtom(atom);
	const fieldName = useModelPathWithSuffix({
		path,
		suffix: "insertSpaces",
	});
	return (
		<CheckboxField
			label="Insert spaces"
			helperText="Insert spaces instead of tabs"
			name={fieldName}
			checked={value}
			onChange={(e) => setValue(e.target.checked)}
		/>
	);
};

export const TabSizeInput: React.FC<
	WithInsertSpaceAtomProps<TextModelFieldProps<"tabSize">>
> = ({ path, atom, insertSpacesAtom }) => {
	const [value, setValue] = useAtom(atom);
	const fieldName = useModelPathWithSuffix({
		path,
		suffix: "tabSize",
	});
	const insertSpaces = useAtomValue(insertSpacesAtom);
	return (
		<NumberInputField
			label="Tab size"
			helperText="Number of spaces for a tab"
			name={fieldName}
			value={value}
			onChange={(nextValue) => setValue(Number(nextValue))}
			min={MIN_INDENT_SIZE}
			max={MAX_INDENT_SIZE}
			{...(insertSpaces && {
				isReadOnly: true,
				isDisabled: true,
			})}
		/>
	);
};

export const IndentSizeInput: React.FC<
	WithInsertSpaceAtomProps<TextModelFieldProps<"indentSize">>
> = ({ path, atom, insertSpacesAtom }) => {
	const [value, setValue] = useAtom(atom);
	const fieldName = useModelPathWithSuffix({
		path,
		suffix: "indentSize",
	});
	const insertSpaces = useAtomValue(insertSpacesAtom);
	return (
		<NumberInputField
			label="Indent size"
			helperText="Number of spaces for an indent"
			name={fieldName}
			value={value}
			onChange={(_, nextValue) => setValue(nextValue)}
			min={MIN_INDENT_SIZE}
			max={MAX_INDENT_SIZE}
			{...(!insertSpaces && {
				isReadOnly: true,
				isDisabled: true,
			})}
		/>
	);
};

function useModelPathWithSuffix({
	path,
	suffix,
	separator = "-",
}: Playground.editor.PropsWithModelPath<{
	suffix: string;
	separator?: string;
}>): string {
	return useMemo(() => {
		return path + separator + suffix;
	}, [path, suffix, separator]);
}
