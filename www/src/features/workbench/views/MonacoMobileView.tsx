import { MultifileEditor } from "@components/editor";
import { textModelFiles } from "@components/editor/data";
import type { EditorProviderProps } from "@components/editor/editor-provider/EditorProvider";
import type React from "react";

export type MonacoMobileViewProps = Playground.types.Omitted<
	EditorProviderProps,
	"files"
>;

export const MonacoMobileView: React.FC<MonacoMobileViewProps> = (props) => (
	<MultifileEditor
		files={textModelFiles}
		{...props}
	/>
);
