import { Box, GridItem, Show } from "@chakra-ui/react";
import { AboutModal } from "@features/about-modal";
import { AboutModalButtonSkeleton } from "@features/about-modal/AboutModalButtonSkeleton";
import { SettingsModal } from "@features/settings-modal";
import { SettingsModalButtonSkeleton } from "@features/settings-modal/SettingsModalButtonSkeleton";
import {
	Logo,
	MoreOptionsMenu,
	ToolbarContainer,
	ToolbarHeading,
	ToolbarLeft,
	ToolbarRight,
} from "@features/toolbar";
import { MonacoEditorEffect } from "@features/workbench/effects";
import { FooterContent } from "@features/workbench/FooterContent";
import { lazy, Suspense, useDeferredValue, useMemo } from "react";
import { LayoutArea, LayoutVariant } from "./constants";
import { FooterContainer } from "./FooterContainer";
import { useLayout } from "./hooks";
import { LayoutPicker } from "./LayoutPicker";
import { useIsSmallScreenAtomValue } from "@state";

const MonacoSplitView = lazy(() =>
	import("./views/MonacoSplitView").then((mod) => ({
		default: mod.MonacoSplitView,
	})),
);

const SettingsModalButton = lazy(() =>
	import("@features/settings-modal/SettingsModalButton").then((mod) => ({
		default: mod.SettingsModalButton,
	})),
);

const AboutModalButton = lazy(() =>
	import("@features/about-modal/AboutModalButton").then((mod) => ({
		default: mod.AboutModalButton,
	})),
);

export const MonacoWorkbench: React.FC = () => {
	const [layout, handleLayoutChange] = useLayout();
	const isMobile = useIsSmallScreenAtomValue();
	// On mobile, use the tabs layout
	const layoutOverride = useMemo(
		() => (isMobile ? LayoutVariant.Tabs : layout),
		[isMobile, layout],
	);
	const deferredLayout = useDeferredValue(layoutOverride);
	return (
		<>
			<Box
				display="grid"
				height="100vh"
				gridTemplateColumns={{ base: "100vw", md: "auto" }}
				gridTemplateRows={{ base: "48px 1fr", md: "70px auto 50px" }}
				gridGap={{ base: 0, md: "1rem" }}
				overflow={{ base: "auto", md: "hidden" }}
				gridTemplateAreas={{
					base: `
                    "${LayoutArea.Header}"
                    "${LayoutArea.Content}"
                `,
					md: `
                    "${LayoutArea.Header}"
                    "${LayoutArea.Content}"
                    "${LayoutArea.Footer}"
                `,
				}}
				sx={{
					".content-item": {
						opacity: deferredLayout !== layout ? 0.5 : 1,
					},
				}}
			>
				<GridItem
					gridArea={LayoutArea.Header}
					className="header toolbar-container"
					shadow="lg"
					as={ToolbarContainer}
					paddingInline={{ base: 2, md: 0 }}
				>
					<ToolbarLeft>
						<Logo />
						<ToolbarHeading />
					</ToolbarLeft>
					<ToolbarRight>
						<Show above="md">
							<LayoutPicker
								value={layout}
								onChange={handleLayoutChange}
							/>
						</Show>
						<Show above="sm">
							<Suspense
								fallback={<SettingsModalButtonSkeleton />}
							>
								<SettingsModalButton />
							</Suspense>
							<Suspense fallback={<AboutModalButtonSkeleton />}>
								<AboutModalButton />
							</Suspense>
						</Show>
						<Show below="sm">
							<MoreOptionsMenu />
						</Show>
					</ToolbarRight>
				</GridItem>
				<Suspense fallback={null}>
					<MonacoSplitView variant={deferredLayout} />
				</Suspense>
				<Show above="md">
					<GridItem
						gridArea={LayoutArea.Footer}
						className="footer"
						as={FooterContainer}
					>
						<FooterContent />
					</GridItem>
				</Show>
			</Box>
			<Suspense fallback={null}>
				<SettingsModal />
				<AboutModal />
				<MonacoEditorEffect />
			</Suspense>
		</>
	);
};
