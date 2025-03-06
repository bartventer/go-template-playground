import {
	type MenuOptionGroupProps,
	Box,
	Menu,
	MenuButton,
	MenuItemOption,
	MenuList,
	MenuOptionGroup,
	Portal,
} from "@chakra-ui/react";
import { TooltipIconButton } from "@components/tooltip-icon-button";
import { memo } from "react";
import type { LayoutVariant } from "./constants";
import { ContentLayouts } from "./ContentLayout";
import { LayoutMasonryIcon } from "@components/icons/layout-icons";

interface LayoutPickerProps extends Pick<MenuOptionGroupProps, "onChange"> {
	value: LayoutVariant;
}

export const LayoutPicker: React.FC<LayoutPickerProps> = memo(
	({ value, onChange }) => {
		return (
			<Menu>
				<MenuButton
					as={TooltipIconButton}
					aria-label="Change layout"
					tooltipLabel="Change layout"
					icon={<LayoutMasonryIcon />}
				/>
				<Portal>
					<MenuList>
						<MenuOptionGroup
							title="Layout"
							type="radio"
							onChange={onChange}
							value={value}
						>
							{Object.entries(ContentLayouts).map(
								([key, { label, icon }]) => (
									<MenuItemOption
										key={key}
										value={key}
										sx={{
											"span[class*='icon']:last-of-type":
												{
													color: "currentColor",
													opacity: 0.5,
												},
											_checked: {
												"span[class*='icon']:last-of-type":
													{
														opacity: 1,
													},
											},
										}}
									>
										<Box
											as="span"
											display="flex"
											alignItems="center"
											justifyContent="space-between"
										>
											<span>{label}</span>
											<span>{icon}</span>
										</Box>
									</MenuItemOption>
								),
							)}
						</MenuOptionGroup>
					</MenuList>
				</Portal>
			</Menu>
		);
	},
);
