import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

export const ChangelogSkeleton: React.FC = () => (
	<Box
		p={4}
		className="changelog-skeleton"
	>
		{/* Main Header Skeleton */}
		<SkeletonText
			width="30%"
			noOfLines={1}
			skeletonHeight={"10"}
			mb={6}
		/>
		{Array.from({ length: 2 }).map((_, i) => (
			<Box
				key={i}
				mb={6}
			>
				{/* Section Header Skeleton */}
				<Box mb={4}>
					<SkeletonText
						width="50%"
						noOfLines={1}
						skeletonHeight={"8"}
					/>
				</Box>
				{/* Bullet Points Skeleton */}
				<Box mb={4}>
					{Array.from({ length: 3 }).map((_, j) => (
						<Box
							key={j}
							display="flex"
							alignItems="center"
							mb={2}
						>
							<SkeletonCircle
								size="4"
								mr={2}
							/>
							<SkeletonText
								width="80%"
								noOfLines={1}
								skeletonHeight={"4"}
							/>
						</Box>
					))}
				</Box>
				{/* Paragraph Skeleton */}
				<SkeletonText
					mt="4"
					noOfLines={4}
					spacing="4"
				/>
			</Box>
		))}
	</Box>
);
