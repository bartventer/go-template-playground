import { Container, Show } from "@chakra-ui/react";
import { TextModelPreferencesEffect } from "@features/workbench/effects";
import { Suspense } from "react";
import { LayoutArea } from "../constants";
import { ContentLayouts } from "../ContentLayout";
import { type UseMonacoSplitViewProps, useMonacoSplitView } from "../hooks";
import { MonacoDesktopView } from "./MonacoDesktopView";
import { MonacoMobileView } from "./MonacoMobileView";

/**
 * `MonacoSplitView` is a React functional component that renders a split view layout
 * for the Monaco editor, adapting to different screen sizes. It uses the {@link useMonacoSplitView}
 * hook to manage the editor's state and behavior.
 *
 * @param {UseMonacoSplitViewProps} props - The properties passed to the component.
 * @param {string} props.variant - The variant of the layout to be used.
 *
 * @returns {JSX.Element} The rendered split view layout containing either a mobile or desktop
 * editor view based on the screen size, and a text model preferences effect.
 */
export const MonacoSplitView: React.FC<UseMonacoSplitViewProps> = ({
	variant,
}: UseMonacoSplitViewProps) => {
	const { fullscreen, ...providerProps } = useMonacoSplitView({ variant });

	return (
		<>
			<Container
				as="main"
				gridArea={LayoutArea.Content}
				maxW={{
					base: "100%",
					lg: fullscreen ? "full" : "container.xl",
				}}
				display={{ base: "block", md: "grid" }}
				gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
				gridTemplateRows={{ base: "auto", md: "1fr 1fr" }}
				gridGap="1rem"
				gridTemplateAreas={ContentLayouts[variant].value}
				paddingInline={{ base: 0, md: 4 }}
				marginTop={{ base: 2, md: 0 }}
			>
				<Show below="md">
					<MonacoMobileView {...providerProps} />
				</Show>
				<Show above="md">
					<MonacoDesktopView
						variant={variant}
						{...providerProps}
					/>
				</Show>
			</Container>
			<Suspense fallback={null}>
				<TextModelPreferencesEffect />
			</Suspense>
		</>
	);
};
