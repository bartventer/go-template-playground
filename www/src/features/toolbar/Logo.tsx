import { Image } from "@chakra-ui/react";
import gopherLogo from "@assets/gopher.svg";

export const Logo: React.FC = () => (
	<Image
		className="logo"
		src={gopherLogo}
		alt="Go Gopher Logo"
		boxSize="40px"
	/>
);
