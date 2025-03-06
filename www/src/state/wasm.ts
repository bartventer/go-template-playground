import { debugAtoms } from "@utils/atoms";
import { atom, useAtom } from "jotai";

export const wasmReadyAtom = atom<boolean>(false);
debugAtoms([wasmReadyAtom, "wasmReadyAtom"]);

export const useWasmReadyAtom = () => useAtom(wasmReadyAtom);
