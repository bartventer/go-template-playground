import { LayoutVariant } from "@features/workbench/constants";
import { debugAtoms } from "@utils/atoms";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const layoutAtom = atomWithStorage<LayoutVariant>(
	"editor-preferences:layout",
	LayoutVariant.OutputBottom,
	undefined,
	{ getOnInit: true },
);

export const useLayoutAtom = () => useAtom(layoutAtom);

debugAtoms([layoutAtom, "editor-preferences:global:layout"]);
