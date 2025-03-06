import { atomWithDisclosure } from "@atoms/disclosure";
import { useAtomValue, useSetAtom } from "jotai";

const [isAboutOpenAtom, openAboutAtom, closeAboutAtom] = atomWithDisclosure({
	id: "about",
});

export const useIsAboutOpenAtomValue = () => useAtomValue(isAboutOpenAtom);
export const useOpenAboutAtom = () => useSetAtom(openAboutAtom);
export const useCloseAboutAtom = () => useSetAtom(closeAboutAtom);
