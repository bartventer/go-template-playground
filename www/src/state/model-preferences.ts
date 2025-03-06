import {
	atomWithTextModelPreferences,
	type TextModelPreferencesState,
} from "@atoms";
import {
	textModelDataFile,
	textModelOutputFile,
	textModelTemplateFile,
	type TextModelPath,
} from "@components/editor/data";
import { atom, useAtomValue } from "jotai";

const [templatePreferencesAtom, useTemplatePreferencesListener] =
	atomWithTextModelPreferences(textModelTemplateFile.path);
const [contextPreferencesAtom, useContextPreferencesListener] =
	atomWithTextModelPreferences(textModelDataFile.path);
const [outputPreferencesAtom, useOutputPreferencesListener] =
	atomWithTextModelPreferences(textModelOutputFile.path);

/** Custom hook that sets up listeners for various text model preferences. */
export const useTextModelPreferencesListener = () => {
	useTemplatePreferencesListener();
	useContextPreferencesListener();
	useOutputPreferencesListener();
};

/** Atom that stores the preferences for each text model. */
export const textModelPreferencesAtom = atom<
	Record<TextModelPath, TextModelPreferencesState>
>((get) => ({
	[textModelTemplateFile.path]: get(templatePreferencesAtom),
	[textModelDataFile.path]: get(contextPreferencesAtom),
	[textModelOutputFile.path]: get(outputPreferencesAtom),
}));

export const useTemplateModelPreferencesAtomValue = () =>
	useAtomValue(templatePreferencesAtom);
export const useContextModelPreferencesAtomValue = () =>
	useAtomValue(contextPreferencesAtom);
export const useOutputModelPreferencesAtomValue = () =>
	useAtomValue(outputPreferencesAtom);
