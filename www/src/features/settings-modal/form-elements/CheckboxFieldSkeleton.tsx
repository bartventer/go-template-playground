import { Flex, Skeleton, SkeletonText } from "@chakra-ui/react";

export const CheckboxFieldSkeleton: React.FC = () => (
	<Flex
		flexDirection="column"
		alignItems="flex-start"
		width="100%"
		gap={3}
	>
		{/* Label */}
		<SkeletonText
			noOfLines={1}
			skeletonHeight={"1em"}
			width={{ base: "40%", sm: "30%" }}
		/>
		<Flex
			alignItems="center"
			width="100%"
		>
			{/* Checkbox */}
			<Skeleton
				height="1.125em"
				width="1.125em"
				mr={2}
			/>
			{/* Helper Text */}
			<SkeletonText
				noOfLines={1}
				skeletonHeight={"1em"}
				width={{ base: "80%", sm: "60%" }}
			/>
		</Flex>
	</Flex>
);
