import type { MenuOptionGroupProps } from "@chakra-ui/react";
import { useLayoutAtom } from "@state";
import { useCallback } from "react";
import type { LayoutVariant } from "../constants";

/**
 * Custom hook to manage the layout state.
 *
 * This hook provides the current layout state and a function to update it.
 * It uses `useLayoutAtom` to manage the state and `requestAnimationFrame` to
 * ensure the state update is performed in the next animation frame.
 *
 * @returns A tuple containing the current layout state and a function to update it.
 */
export function useLayout(): readonly [
	value: LayoutVariant,
	onChange: (newValue: string | string[]) => void,
] {
	const [value, setValue] = useLayoutAtom();
	const onChange = useCallback<Required<MenuOptionGroupProps>["onChange"]>(
		(newValue) => {
			requestAnimationFrame(
				() => void setValue(newValue as LayoutVariant),
			);
		},
		[setValue],
	);

	return [value, onChange] as const;
}
