import type { ChakraTheme, Theme, ThemeConfig } from "@chakra-ui/react";
import { cssVar, extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { tabsTheme } from "./components/tabs";

type ZIndexKey = keyof Theme["zIndices"];

const $editorBg = cssVar("vscode-editor-background");
const $editorFg = cssVar("vscode-editor-foreground");

const config: ThemeConfig = {
	initialColorMode: "system",
	useSystemColorMode: true,
};

const colors = {
	editor: {
		background: $editorBg.reference,
		foreground: $editorFg.reference,
	},
} as const;

const components = {
	Link: {
		baseStyle: {
			_hover: {
				color: "teal.500",
			},
		},
	},
	Popover: {
		// https://github.com/chakra-ui/chakra-ui/pull/7778#issuecomment-1676455359
		baseStyle: {
			popper: {
				zIndex: "popover" satisfies ZIndexKey,
			},
		},
	},
	Menu: {
		baseStyle: {
			list: {
				zIndex: "dropdown" satisfies ZIndexKey,
				fontSize: "sm",
				"--menu-bg": $editorBg.reference,
				_dark: {
					"--menu-bg": $editorBg.reference,
				},
			},
		},
	},
	Button: {
		baseStyle: {
			textTransform: "uppercase",
		},
	},
	Modal: {
		baseStyle: {
			dialog: {
				"--modal-bg": $editorBg.reference,
				_dark: {
					"--modal-bg": $editorBg.reference,
				},
			},
		},
	},
	Select: {
		baseStyle: {
			field: {
				"--select-bg": $editorBg.reference,
				_dark: {
					"--select-bg": $editorBg.reference,
				},
			},
		},
	},
	Tabs: tabsTheme,
};

const styles = {
	global: {
		body: {
			background: $editorBg.reference,
		},
		".editor-shell": {
			backgroundColor: $editorBg.reference,
			color: $editorFg.reference,
		},
		"@media (max-width: 320px)": {
			body: {
				minWidth: "320px",
			},
		},
	},
};
const theme: Partial<ChakraTheme> = extendTheme(
	{ colors, components, styles },
	config,
	withDefaultColorScheme({ colorScheme: "teal", components: ["Button"] }),
);

export { theme };
