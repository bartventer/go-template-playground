import type { IconButtonProps, TooltipProps } from "@chakra-ui/react";
import { IconButton, Tooltip } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface TooltipIconButtonProps extends IconButtonProps {
	tooltipLabel: string;
	tooltipProps?: Partial<TooltipProps>;
}

const defaultTooltipProps: Partial<TooltipProps> = {
	hasArrow: true,
	placement: "top",
	openDelay: 500,
	fontSize: "sm",
};

/**
 * A button with an icon that displays a tooltip when hovered.
 *
 * See {@link defaultTooltipProps} for the default tooltip props.
 */
export const TooltipIconButton = forwardRef<
	HTMLButtonElement,
	TooltipIconButtonProps
>(({ tooltipLabel, tooltipProps, ...iconButtonProps }, ref) => (
	<Tooltip
		label={tooltipLabel}
		{...defaultTooltipProps}
		{...tooltipProps}
	>
		<IconButton
			className="tooltip-icon-button"
			ref={ref}
			onFocus={(e) => e.preventDefault()}
			{...iconButtonProps}
		/>
	</Tooltip>
));
