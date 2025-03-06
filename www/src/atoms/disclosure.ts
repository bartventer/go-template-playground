import { debugAtoms, privatizeAtoms } from "@utils/atoms";
import { atom, type Atom, type PrimitiveAtom, type WritableAtom } from "jotai";

type PropsWithID<T = unknown> = T & {
	/** A unique identifier for the atom. */
	id: string;
};

type IsOpenAtom = Atom<boolean>;
type ToggleAtom = WritableAtom<null, [], void>;

/**
 * `atomWithDisclosure` returns a tuple with three atoms for managing a disclosure.
 * The first atom is a read-only atom that returns the current state of the disclosure.
 * The second atom is a write-only atom that opens the disclosure.
 * The third atom is a write-only atom that closes the disclosure.
 * @returns A tuple with three atoms.
 */
export function atomWithDisclosure({
	id,
}: PropsWithID): [
	isOpenAtom: IsOpenAtom,
	openAtom: ToggleAtom,
	closeAtom: ToggleAtom,
] {
	const isOpenBaseAtom = atom<boolean>(false);
	const isOpenAtom = atom((get) => get(isOpenBaseAtom));
	const openAtom = atom(null, (_get, set) => {
		set(isOpenBaseAtom, true);
	});
	const closeAtom = atom(null, (_get, set) => {
		set(isOpenBaseAtom, false);
	});

	privatizeAtoms(isOpenBaseAtom);
	debugAtoms(
		[isOpenAtom, `${id}-isOpenAtom`],
		[openAtom, `${id}-openAtom`],
		[closeAtom, `${id}-closeAtom`],
	);

	return [isOpenAtom, openAtom, closeAtom] as const;
}

/**
 * Creates a pair of Jotai atoms to manage the state of an active tab.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.id - The unique identifier for the atom.
 * @param {number} params.defaultValue - The default value for the active tab.
 * @returns {[WritableAtom<number, number>, WritableAtom<null, number>]} A tuple containing the active tab atom and the setter atom.
 */
export function atomWithTab({
	id,
	defaultValue,
}: PropsWithID<{ defaultValue: number }>): [
	activeTabAtom: PrimitiveAtom<number>,
	setActiveTabAtom: WritableAtom<null, [newValue: number], void>,
] {
	const activeTabAtom = atom(defaultValue);
	const setActiveTabAtom = atom(null, (_get, set, newValue: number) => {
		set(activeTabAtom, newValue);
	});
	debugAtoms(
		[activeTabAtom, `${id}-activeTabAtom`],
		[setActiveTabAtom, `${id}-setActiveTabAtom`],
	);

	return [activeTabAtom, setActiveTabAtom] as const;
}

/**
 * `atomWithToggle` returns a tuple with two atoms for managing a toggle.
 * The first atom is a read-only atom that returns the current state of the toggle.
 * The second atom is a write-only atom that toggles the state of the toggle.
 * @returns A tuple with two atoms.
 */
export function atomWithToggle({
	id,
}: PropsWithID): [isOpenAtom: IsOpenAtom, toggleAtom: ToggleAtom] {
	const isOpenBaseAtom = atom<boolean>(false);
	const isOpenAtom = atom((get) => get(isOpenBaseAtom));
	const toggleAtom = atom(null, (_get, set) => {
		set(isOpenBaseAtom, (prev) => !prev);
	});
	privatizeAtoms(isOpenBaseAtom);
	debugAtoms(
		[isOpenAtom, `${id}-isOpenAtom`],
		[toggleAtom, `${id}-toggleAtom`],
	);
	return [isOpenAtom, toggleAtom] as const;
}
