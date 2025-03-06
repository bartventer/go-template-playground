import {
	LayoutColumnsIcon,
	LayoutOutputBottomIcon,
	LayoutOutputLeftIcon,
	LayoutOutputRightIcon,
	LayoutRowsIcon,
	LayoutTabIcon,
} from "@components/icons/layout-icons";
import { ContentArea, LayoutVariant } from "./constants";

interface ContentLayout {
	value: string;
	label: string;
	icon: React.ReactElement;
}

export const ContentLayouts = {
	[LayoutVariant.OutputBottom]: {
		value: `
		"${ContentArea.Template} ${ContentArea.Data}"
        "${ContentArea.Output} ${ContentArea.Output}"
	`,
		label: "Output Bottom",
		icon: <LayoutOutputBottomIcon />,
	},
	[LayoutVariant.OutputRight]: {
		value: `
		"${ContentArea.Template} ${ContentArea.Output}"
        "${ContentArea.Data} ${ContentArea.Output}"
	`,
		label: "Output Right",
		icon: <LayoutOutputRightIcon />,
	},
	[LayoutVariant.OutputLeft]: {
		value: `
		"${ContentArea.Output} ${ContentArea.Template}"
        "${ContentArea.Output} ${ContentArea.Data}"
	`,
		label: "Output Left",
		icon: <LayoutOutputLeftIcon />,
	},
	[LayoutVariant.VerticalSplit]: {
		value: `
		"${ContentArea.Template} ${ContentArea.Template}"
		"${ContentArea.Output} ${ContentArea.Output}"
	`,
		label: "Vertical Split",
		icon: <LayoutRowsIcon />,
	},
	[LayoutVariant.HorizontalSplit]: {
		value: `
		"${ContentArea.Template} ${ContentArea.Output}"
		"${ContentArea.Template} ${ContentArea.Output}"
	`,
		label: "Horizontal Split",
		icon: <LayoutColumnsIcon />,
	},
	[LayoutVariant.Tabs]: {
		value: `
		"${ContentArea.Template} ${ContentArea.Template}"
		"${ContentArea.Template} ${ContentArea.Template}"
	`,
		label: "Tabs",
		icon: <LayoutTabIcon />,
	},
} as const satisfies Record<LayoutVariant, ContentLayout>;
