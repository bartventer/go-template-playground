import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@theme";
import type { PropsWithChildren } from "react";
import { useLocalColorModeManager } from "./atoms";

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const colorModeManager = useLocalColorModeManager();
	return (
		<ChakraProvider
			theme={theme}
			colorModeManager={colorModeManager}
		>
			{children}
		</ChakraProvider>
	);
};
