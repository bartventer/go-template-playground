import { App } from "@App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);

// See https://github.com/suren-atoyan/monaco-react/issues/575
window.addEventListener("unhandledrejection", (event) => {
	if (event.reason && event.reason.name === "Canceled") {
		event.preventDefault();
		console.warn("Promise was canceled:", event.reason.message);
	}
});
