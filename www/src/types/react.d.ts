import type React from "react";

declare module "react" {
	function memo<A, B>(
		Component: (props: A) => B,
	): (props: A) => React.ReactElement | null;
}
