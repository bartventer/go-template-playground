interface PrivateAtom {
	debugPrivate?: boolean;
}

/**
 * Ensures that the provided atoms are marked as private in development mode.
 */
export function privatizeAtoms(...atoms: PrivateAtom[]): void {
	if (!import.meta.env.DEV) return;
	for (let index = 0; index < atoms.length; index++) {
		atoms[index].debugPrivate = true;
	}
}

interface DebugAtom extends PrivateAtom {
	debugLabel?: string;
}

/**
 * Assigns debug labels to atoms if in development mode.
 *
 * NOTE: Private atoms will be ignored.
 */
export function debugAtoms(
	...atoms: Array<[atom: DebugAtom, label: string]>
): void {
	if (!import.meta.env.DEV) return;
	for (let index = 0; index < atoms.length; index++) {
		const [atom, label] = atoms[index];
		if (atom.debugPrivate) continue;
		atom.debugLabel = label;
	}
}
