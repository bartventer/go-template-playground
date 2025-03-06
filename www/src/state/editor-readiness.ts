import { debugAtoms, privatizeAtoms } from "@utils/atoms";
import { atom, useAtom, useAtomValue } from "jotai";
import { atomEffect } from "jotai-effect";

// The sequence of readiness is as follows:
//	1. Editors ready
//	2. Models ready
//	3. Monaco ready

const editorsReadyAtom = atom<boolean>(false);
export const modelsReadyAtom = atom<boolean>(false);
export const monacoReadyAtom = atom<boolean>(false);

const monacoReadyEffect = atomEffect((get, set) => {
	if (get.peek(monacoReadyAtom)) return;
	const editorsReady = get(editorsReadyAtom);
	const modelsReady = get(modelsReadyAtom);
	if (editorsReady && modelsReady) {
		set(monacoReadyAtom, true);
	}
});

export const useEditorsReadyAtom = () => useAtom(editorsReadyAtom);
export const useMonacoReadyAtomValue = () => useAtomValue(monacoReadyAtom);
export const useMonacoReadyEffect = () => useAtom(monacoReadyEffect);

privatizeAtoms(monacoReadyEffect);
debugAtoms(
	[editorsReadyAtom, "editorsReadyAtom"],
	[modelsReadyAtom, "modelsReadyAtom"],
	[monacoReadyAtom, "monacoReadyAtom"],
);
