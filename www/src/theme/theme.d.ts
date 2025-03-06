import type { Theme } from "@chakra-ui/react";

interface CustomColors {
	custom: {
		vscodeEditorBackground: string;
		vscodeEditorForeground: string;
	};
}

declare module "@chakra-ui/react" {
	export type Colors = Theme["colors"] & CustomColors;

	export interface ChakraTheme {
		colors: Colors;
		zIndices: Theme["zIndices"];
		config: Theme["config"];
	}
}
