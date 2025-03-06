import { ThemeProvider } from "@features/theme";
import { MonacoWorkbench, MonacoWorkbenchSkeleton } from "@features/workbench";
import "@lib/monaco-editor/setup-monaco";
import { Suspense } from "react";
// import { DevTools } from "jotai-devtools";
// import "jotai-devtools/styles.css";

export const App: React.FC = () => (
	// <>
	// <DevTools />
	<ThemeProvider>
		<Suspense fallback={<MonacoWorkbenchSkeleton />}>
			<MonacoWorkbench />
		</Suspense>
	</ThemeProvider>
	// </>
);
