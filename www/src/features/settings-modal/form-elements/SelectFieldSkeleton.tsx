import { Flex, Skeleton, SkeletonText } from "@chakra-ui/react";

export const SelectFieldSkeleton: React.FC = () => (
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
		{/* Helper Text */}
		<SkeletonText
			noOfLines={1}
			skeletonHeight={"1em"}
			width={{ base: "80%", sm: "60%" }}
		/>
		{/* Select */}
		<Skeleton
			height="2em"
			width="100%"
		/>
	</Flex>
);
