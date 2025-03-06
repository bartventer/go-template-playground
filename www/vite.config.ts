import { getScriptSrc } from "@chakra-ui/react";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import {
	defineConfig,
	loadEnv,
	PluginOption,
	type UserConfigFnObject,
} from "vite";
import { VitePWA, type ManifestOptions } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig((props) => {
	const { mode } = props;
	const env = loadEnv(mode, process.cwd());
	return {
		optimizeDeps: {
			needsInterop: [
				"monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js",
			],
		},
		plugins: [
			react(),
			tsconfigPaths(),
			visualizer({
				filename: env.ROLLUP_VISUALIZER_PATH,
				gzipSize: true,
				brotliSize: true,
			}) as PluginOption,
			htmlTransformPlugin(),
			VitePWA({
				registerType: "autoUpdate",
				manifestFilename: "site.webmanifest",
				devOptions: {
					enabled: true,
				},
				workbox: {
					maximumFileSizeToCacheInBytes: 20 * 1024 * 1024, // 20 MB
				},
				manifest: createManifestOptions(props),
			}),
		],
		resolve: {
			alias: {
				"@lib": "/src/lib",
			},
		},
		server: {
			port: 3000,
			proxy: {
				"/api": {
					target: "https://api.github.com",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ""),
				},
			},
		},
		build: {
			sourcemap: true,
			rollupOptions: {
				output: {
					compact: true,
					manualChunks: (() => {
						const chunkPaths = createRollupManualChunks(props);
						return (id, _meta) => {
							if (!id.includes("node_modules")) return;
							for (const chunkPath of chunkPaths) {
								if (!id.includes(chunkPath)) continue;
								return chunkPath.replace(/\/|\./g, "-");
							}
						};
					})(),
				},
				onwarn(warning, logWarning) {
					if (
						warning.code === "SOURCEMAP_ERROR" &&
						warning.loc &&
						warning.loc.file?.includes("framer-motion")
					) {
						// Ignore source map errors for framer-motion
						return;
					}
					logWarning(warning);
				},
			},
		},
	};
});

function htmlTransformPlugin(): PluginOption {
	return {
		name: "html-transform",
		transformIndexHtml(html) {
			return html.replace(
				"</head>",
				`<script id="chakra-script"  nonce="${crypto.randomUUID()}">
					${getScriptSrc({ initialColorMode: "system" })}
				</script>
				</head>`,
			);
		},
	};
}

function createRollupManualChunks(...[_env]: Parameters<UserConfigFnObject>) {
	return [
		"react-dom",
		"@chakra-ui/styled-system",
		// monaco-editor
		"monaco-editor/esm/vs/base/browser/dom",
		"monaco-editor/esm/vs/base/browser/dompurify",
		"monaco-editor/esm/vs/base/browser/touch",
		"monaco-editor/esm/vs/base/browser/markdownRenderer",
		"monaco-editor/esm/vs/base/browser/defaultWorkerFactory",
		"monaco-editor/esm/vs/base/browser/fastDomNode",
		"monaco-editor/esm/vs/base/browser/performance",
		"monaco-editor/esm/vs/base/browser/pixelRatio",
		"monaco-editor/esm/vs/base/browser/keyboardEvent",
		"monaco-editor/esm/vs/base/browser/ui",
		"monaco-editor/esm/vs/base/browser",
		"monaco-editor/esm/vs/base",
		"monaco-editor/esm/vs/editor/browser/widget/diffEditor/components",
		"monaco-editor/esm/vs/editor/browser",
		"monaco-editor/esm/vs/editor/common",
		"monaco-editor/esm/vs/editor/contrib",
		"monaco-editor/esm/vs/platform",
	] as const;
}

function createManifestOptions(
	...[_env]: Parameters<UserConfigFnObject>
): Partial<ManifestOptions> {
	return {
		name: "Go Template Playground",
		short_name: "GoTP",
		description:
			"An interactive environment to create and test Go templates.",
		theme_color: "#ffffff",
		background_color: "#ffffff",
		display: "standalone",
		icons: [
			{
				src: "android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "android-chrome-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
			{
				src: "apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
			},
			{
				src: "favicon-16x16.png",
				sizes: "16x16",
				type: "image/png",
			},
			{
				src: "favicon-32x32.png",
				sizes: "32x32",
				type: "image/png",
			},
			{
				src: "safari-pinned-tab.svg",
				sizes: "any",
				type: "image/svg+xml",
				purpose: "maskable",
			},
		],
		screenshots: [
			{
				src: "screenshot-desktop-dark-1920x927.png",
				sizes: "1920x927",
				type: "image/png",
				form_factor: "wide",
				label: "Desktop (dark theme)",
			},
			{
				src: "screenshot-desktop-light-1920x927.png",
				sizes: "1920x927",
				type: "image/png",
				form_factor: "wide",
				label: "Desktop (light theme)",
			},
			{
				src: "screenshot-mobile-dark-750x1334.png",
				sizes: "750x1334",
				type: "image/png",
				form_factor: "narrow",
				label: "Mobile (dark theme)",
			},
			{
				src: "screenshot-mobile-light-750x1334.png",
				sizes: "750x1334",
				type: "image/png",
				form_factor: "narrow",
				label: "Mobile (light theme)",
			},
		],
		categories: ["utilities"],
	} as const;
}
