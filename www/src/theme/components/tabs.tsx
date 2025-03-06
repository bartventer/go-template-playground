import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

// eslint-disable-next-line @typescript-eslint/unbound-method
const { definePartsStyle, defineMultiStyleConfig } =
	createMultiStyleConfigHelpers(tabsAnatomy.keys);

const variantEnclosedFile = definePartsStyle((props) => {
	const { colorScheme: c } = props;

	return {
		tab: {
			backgroundColor: "var(--vscode-tab-inactiveBackground)",
			marginTop: "1px",
			borderStart: "1px solid",
			borderStartColor: "inherit",
			borderInline: "1px solid",
			borderInlineColor: mode(
				"inherit",
				"var(--vscode-tab-border)",
			)(props),
			borderBottom: "1px solid transparent",
			// Scroll snap
			scrollSnapAlign: "start",
			scrollSnapStop: "normal",
			scrollMarginInline: 0,
			scrollMarginBlock: 0,
			scrollPaddingInline: 0,
			scrollPaddingBlock: 0,
			_first: {
				borderStart: { md: "none" },
			},
			_notLast: {
				marginEnd: "-1px",
			},
			_selected: {
				position: "relative",
				color: mode(`${c}.500`, `${c}.300`)(props),
				backgroundColor: "var(--vscode-tab-activeBackground)",
				":before": {
					content: '""',
					position: "absolute",
					top: "-2px",
					left: 0,
					right: 0,
					height: "2px",
					backgroundColor: "currentColor",
					borderTopRadius: "sm",
				},
				".tab-close-button": {
					visibility: "visible",
					opacity: 1,
				},
			},
			".tab-close-button": {
				transition: "visibility 0.2s, opacity 0.2s",
				visibility: { base: "visible", md: "hidden" },
				opacity: { base: 1, md: 0 },
			},
			_hover: {
				".tab-close-button": {
					visibility: "visible",
					opacity: 1,
				},
			},
			":not([aria-selected='true'])": {
				color: "var(--vscode-tab-inactiveForeground)",
			},
			".file-icon": {
				marginInlineStart: -1,
				marginInlineEnd: 1,
				fontSize: "xs",
			},
		},
		tablist: {
			paddingInlineStart: { base: "52px", md: "0" },
			overflowX: "auto",
			overflowY: "hidden",
			scrollSnapType: "x mandatory",
			scrollBehavior: "smooth",
			"&::-webkit-scrollbar": {
				display: "none", // Safari and Chrome
			},
			WebkitOverflowScrolling: "touch", // iOS momentum scrolling for iOS < 13.0
			msOverflowStyle: "none", // IE and Edge
			scrollbarWidth: "none", // Firefox
		},
	};
});

const variants = {
	"enclosed-file": variantEnclosedFile,
};

const defaultProps = {
	size: "sm",
	variant: "enclosed-file",
	colorScheme: "blue",
};

export const tabsTheme = defineMultiStyleConfig({
	variants,
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-expect-error
	defaultProps,
});
