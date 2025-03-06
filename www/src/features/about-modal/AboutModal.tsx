import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import { displayName } from "package.json";
import { lazy, Suspense } from "react";
import { useCloseAboutAtom, useIsAboutOpenAtomValue } from "./atoms";
import { RepoReportBugButton, RepoSourceButton } from "./buttons";
import { ChangelogSkeleton } from "./changelog";

const Changelog = lazy(() =>
	import("./changelog").then((mod) => ({
		default: mod.Changelog,
	})),
);

export const AboutModal: React.FC = () => {
	const isOpen = useIsAboutOpenAtomValue();
	const onClose = useCloseAboutAtom();
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
				height={{
					base: "clamp(300px, 80vh, 600px)",
					md: "clamp(300px, 80vh, 800px)",
				}}
			>
				<ModalHeader borderBottomWidth="1px">{displayName}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Suspense fallback={<ChangelogSkeleton />}>
						<Changelog />
					</Suspense>
				</ModalBody>
				<ModalFooter gap={2}>
					<RepoReportBugButton />
					<RepoSourceButton />
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
