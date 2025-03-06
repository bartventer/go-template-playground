import { MultifileEditor } from "@components/editor";
import {
	textModelDataFile,
	textModelOutputFile,
	textModelTemplateFile,
} from "@components/editor/data";
import { ContentArea, LayoutVariant } from "../constants";
import { ContentItem } from "../ContentItem";
import type { MonacoMobileViewProps } from "./MonacoMobileView";

interface MonacoDesktopViewProps extends MonacoMobileViewProps {
	variant: LayoutVariant;
}

export const MonacoDesktopView: React.FC<MonacoDesktopViewProps> = ({
	variant,
	...props
}) => (
	<>
		<ContentItem area={ContentArea.Template}>
			{/* Tabbed variant */}
			{variant === LayoutVariant.Tabs && (
				<MultifileEditor
					files={[
						textModelTemplateFile,
						textModelDataFile,
						textModelOutputFile,
					]}
					{...props}
				/>
			)}
			{/* Input only (Template + Data) */}
			{[
				LayoutVariant.VerticalSplit,
				LayoutVariant.HorizontalSplit,
			].includes(variant) && (
				<MultifileEditor
					files={[textModelTemplateFile, textModelDataFile]}
					{...props}
				/>
			)}
			{/* Template only */}
			{[
				LayoutVariant.OutputBottom,
				LayoutVariant.OutputRight,
				LayoutVariant.OutputLeft,
			].includes(variant) && (
				<MultifileEditor
					files={[textModelTemplateFile]}
					{...props}
				/>
			)}
		</ContentItem>
		{/* Data only */}
		{![
			LayoutVariant.Tabs,
			LayoutVariant.HorizontalSplit,
			LayoutVariant.VerticalSplit,
		].includes(variant) && (
			<ContentItem area={ContentArea.Data}>
				<MultifileEditor
					files={[textModelDataFile]}
					{...props}
				/>
			</ContentItem>
		)}
		{/* Output only */}
		{variant !== LayoutVariant.Tabs && (
			<ContentItem area={ContentArea.Output}>
				<MultifileEditor
					files={[textModelOutputFile]}
					{...props}
				/>
			</ContentItem>
		)}
	</>
);
