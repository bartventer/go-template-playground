import {
	type ComponentType,
	forwardRef,
	useCallback,
	useImperativeHandle,
	useRef,
} from "react";

/**
 * HOC to add scroll snap behavior to a component
 * @param Component  The component to add scroll snap behavior to
 * @param scrollOptions  The options to pass to `scrollIntoView`
 * @returns  A new component with scroll snap behavior
 */
export const withScrollSnap = <P extends {}>(
	Component: ComponentType<P>,
	scrollOptions: ScrollIntoViewOptions = {
		behavior: "smooth",
		block: "nearest",
		inline: "start",
	},
) => {
	return forwardRef<HTMLElement, P>((props, ref) => {
		const elementRef = useRef<HTMLElement>(null);

		useImperativeHandle(ref, () => elementRef.current as HTMLElement, []);

		const handleClick = useCallback(() => {
			elementRef.current?.scrollIntoView(scrollOptions);
		}, []);

		return (
			<Component
				ref={elementRef}
				onClick={handleClick}
				{...(props as P)}
			/>
		);
	});
};
