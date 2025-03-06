import { Button, Tooltip, type ButtonProps } from "@chakra-ui/react";
import {
	forwardRef,
	type PropsWithChildren,
	type PropsWithoutRef,
} from "react";

interface EditorStatusBarItemProps extends PropsWithoutRef<ButtonProps> {
	ariaLabel: string;
}

export const EditorStatusBarItem = forwardRef<
	HTMLButtonElement,
	PropsWithChildren<EditorStatusBarItemProps>
>(({ ariaLabel, children, _hover, ...props }, ref) => (
	<Tooltip
		label={ariaLabel}
		placement="top"
		hasArrow
		aria-label={ariaLabel}
		openDelay={500}
		fontSize={"xs"}
	>
		<Button
			ref={ref}
			variant="link"
			className="statusbar-item"
			textTransform="none"
			rounded="none"
			size="xs"
			aria-label={ariaLabel}
			colorScheme="gray"
			display="flex"
			alignItems="center"
			justifyContent="center"
			gap={0.5}
			paddingInline={1}
			textDecoration="none"
			overflow="hidden"
			textOverflow="ellipsis"
			whiteSpace="pre"
			height="100%"
			fontWeight="normal"
			_hover={{
				..._hover,
				backgroundColor: "var(--vscode-tab-activeBackground)",
			}}
			{...props}
		>
			{children}
		</Button>
	</Tooltip>
));
