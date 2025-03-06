import { type Atom, type WritableAtom, atom } from "jotai";
import { debugAtoms, privatizeAtoms } from "../utils/atoms";

type AtomWithHashSetReturn<T> = readonly [
	readAtom: Atom<Set<T>>,
	addAtom: WritableAtom<null, [value: T], void>,
	removeAtom: WritableAtom<null, [value: T], void>,
];
type AtomWithHashSetProps<T> = {
	initialValue?: Set<T>;
	debugLabel?: string;
};

export function atomWithHashSet<T>(
	props: AtomWithHashSetProps<T>,
): AtomWithHashSetReturn<T>;
export function atomWithHashSet<T>(): AtomWithHashSetReturn<T>;
export function atomWithHashSet<T>(
	props?: AtomWithHashSetProps<T>,
): AtomWithHashSetReturn<T> {
	const { initialValue = new Set<T>(), debugLabel } = props || {};
	const baseAtom = atom(initialValue);
	const readAtom = atom((get) => get(baseAtom));

	const addAtom = atom(null, (_get, set, value: T) => {
		set(baseAtom, (prev) => {
			if (prev.has(value)) {
				return prev; // No change
			}
			prev.add(value);
			return new Set(prev);
		});
	});

	const removeAtom = atom(null, (_get, set, value: T) => {
		set(baseAtom, (prev) => {
			if (!prev.delete(value)) {
				return prev; // No change
			}
			return new Set(prev);
		});
	});

	privatizeAtoms(baseAtom, addAtom, removeAtom);
	if (debugLabel) {
		debugAtoms([readAtom, debugLabel]);
	} else {
		privatizeAtoms(readAtom);
	}

	return [readAtom, addAtom, removeAtom] as const;
}
