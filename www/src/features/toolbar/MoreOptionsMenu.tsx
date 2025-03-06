import { IconButton, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { EllipsisIcon } from "@components/icons";
import { AboutMenuItem } from "@features/about-modal/AboutMenuItem";
import { SettingsMenuItem } from "@features/settings-modal/SettingsMenuItem";

export const MoreOptionsMenu: React.FC = () => (
	<Menu
		isLazy
		closeOnSelect
		placement="bottom-end"
	>
		<MenuButton
			as={IconButton}
			size="xs"
			aria-label="More options"
			variant="ghost"
			rounded="sm"
			icon={<EllipsisIcon />}
			colorScheme="gray"
		/>
		<MenuList>
			<SettingsMenuItem />
			<AboutMenuItem />
		</MenuList>
	</Menu>
);
