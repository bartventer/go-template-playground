import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from "@chakra-ui/react";
import {
	useActiveSettingsTabAtomValue,
	useCloseSettingsAtom,
	useIsSettingsOpenAtomValue,
	useSetActiveSettingsTabAtom,
} from "./atoms";
import {
	ContextEditorSettingsForm,
	TemplateEditorSettingsForm,
} from "./editor-settings-forms";
import { GeneralSettingsForm } from "./general-settings-form";

export const SettingsModal: React.FC = () => {
	const isOpen = useIsSettingsOpenAtomValue();
	const onClose = useCloseSettingsAtom();
	const activeTab = useActiveSettingsTabAtomValue();
	const setActiveTab = useSetActiveSettingsTabAtom();
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			scrollBehavior="inside"
			size={{
				base: "full",
				sm: "xl",
				md: "2xl",
			}}
		>
			<ModalOverlay />
			<ModalContent
				minHeight={{
					base: "calc(100% - 3.75em)",
					sm: "calc(100% - 4.5em)",
					md: "calc(100% - 5em)",
				}}
			>
				<ModalHeader borderBottomWidth="1px">Settings</ModalHeader>
				<ModalCloseButton />
				<ModalBody
					padding={0}
					borderBottomRadius="md"
					display="flex"
				>
					<Tabs
						variant="line"
						size={{ base: "md", sm: "sm" }}
						flex={1}
						display="flex"
						flexDirection="column"
						paddingTop={2}
						sx={{
							".chakra-tabs__tablist, .chakra-tabs__tab-panels": {
								paddingInline: 6,
							},
						}}
						index={activeTab}
					>
						<TabList
							position="sticky"
							sx={{
								"& [role=tab]": { fontWeight: "bold" },
							}}
						>
							{["General", "Template", "Data"].map(
								(label, index) => (
									<Tab
										key={label}
										onClick={() => setActiveTab(index)}
									>
										{label}
									</Tab>
								),
							)}
						</TabList>
						<TabPanels overflowY="auto">
							<TabPanel>
								<GeneralSettingsForm />
							</TabPanel>
							<TabPanel>
								<TemplateEditorSettingsForm />
							</TabPanel>
							<TabPanel>
								<ContextEditorSettingsForm />
							</TabPanel>
						</TabPanels>
					</Tabs>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
