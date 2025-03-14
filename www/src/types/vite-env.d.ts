/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_VERSION: string;
	readonly VITE_APP_DATE: string;
	readonly VITE_APP_COMMIT: string;
	readonly VITE_APP_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
