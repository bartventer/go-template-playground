import type { ButtonProps, LinkProps } from "@chakra-ui/react";
import { Button, Link } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface LinkButtonProps extends ButtonProps {
	linkProps: LinkProps;
}

/** LinkButton is a `Button` that is wrapped in a `Link` component. */
export const LinkButton = forwardRef<HTMLButtonElement, LinkButtonProps>(
	({ linkProps, ...buttonProps }, ref) => (
		<Link
			className="link-button"
			{...linkProps}
		>
			<Button
				ref={ref}
				{...buttonProps}
			/>
		</Link>
	),
);
