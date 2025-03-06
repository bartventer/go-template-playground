import type { ColorMode } from "@chakra-ui/react";
import { debugAtoms, privatizeAtoms } from "@utils/atoms";
import { atom, useSetAtom } from "jotai";
import { atomWithStorage, useAtomCallback } from "jotai/utils";
import { useCallback } from "react";

const STORAGE_KEY = "chakra-ui-color-mode";

type Maybe<T> = T | undefined;

interface ColorModeStorageManager {
	type: "localStorage";
	ssr?: boolean;
	get(init?: ColorMode): Maybe<ColorMode>;
	set(value: ColorMode | "system"): void;
}

function atomWithColorLocalStorageManager(initialValue: Maybe<ColorMode>) {
	const baseAtom = atomWithStorage<Maybe<ColorMode>>(
		STORAGE_KEY,
		initialValue,
		undefined,
		{
			getOnInit: true,
		},
	);
	const colorModeAtom = atom(
		(get) => get(baseAtom),
		(_get, set, update: ColorMode | "system") => {
			set(baseAtom, update as ColorMode);
		},
	);

	debugAtoms([colorModeAtom, "chakraColorModeAtom"]);
	privatizeAtoms(baseAtom);

	const useLocalColorModeManager = (): ColorModeStorageManager => {
		const getColorMode = useAtomCallback(
			useCallback((get) => {
				return get(colorModeAtom);
			}, []),
		);
		const setColorMode = useSetAtom(colorModeAtom);
		return {
			ssr: false,
			type: "localStorage",
			get: getColorMode,
			set: setColorMode,
		};
	};

	return [colorModeAtom, useLocalColorModeManager] as const;
}

export const [chakraColorModeAtom, useLocalColorModeManager] =
	atomWithColorLocalStorageManager(undefined);
