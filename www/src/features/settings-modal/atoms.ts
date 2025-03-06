import { atomWithDisclosure, atomWithTab } from "@atoms";
import { textModelFiles } from "@components/editor/data";
import { atom, useAtomValue, useSetAtom } from "jotai";

const DEFAULT_SETTINGS_TAB_INDEX = 0;

const [isSettingsOpenAtom, openSettingsAtom, closeSettingsAtom] =
	atomWithDisclosure({
		id: "settings",
	});

export const useIsSettingsOpenAtomValue = () =>
	useAtomValue(isSettingsOpenAtom);
export const useOpenSettingsAtom = () => useSetAtom(openSettingsAtom);
export const useCloseSettingsAtom = () => useSetAtom(closeSettingsAtom);

const [activeTabAtom, setActiveTabAtom] = atomWithTab({
	id: "settings-tab",
	defaultValue: DEFAULT_SETTINGS_TAB_INDEX,
});

const openDefaultSettingsAtom = atom(null, (_get, set) => {
	set(activeTabAtom, DEFAULT_SETTINGS_TAB_INDEX);
	set(openSettingsAtom);
});

export const useActiveSettingsTabAtomValue = () => useAtomValue(activeTabAtom);
export const useSetActiveSettingsTabAtom = () => useSetAtom(setActiveTabAtom);
export const useOpenDefaultSettingsAtom = () =>
	useSetAtom(openDefaultSettingsAtom);

const setEditorFileSettingsAtom = atom(null, (_get, set, uri: string) => {
	const index = textModelFiles.findIndex((file) => file.path === uri);
	if (index === -1) return;
	set(activeTabAtom, index + 1); // +1 to account for the general settings tab
});

export const useSetEditorFileSettingsAtom = () =>
	useSetAtom(setEditorFileSettingsAtom);
