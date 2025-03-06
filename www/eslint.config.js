// @ts-check

import eslint from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: [
			"dist/**/*.ts",
			"dist/**",
			"**/*.mjs",
			"eslint.config.mjs",
			"**/*.js",
		],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			ecmaVersion: 2022,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
			globals: {
				...globals.builtin,
				...globals.browser,
				...globals.es2022,
				...globals.node,
				...globals.worker,
			},
		},
		plugins: {
			// @ts-ignore
			react,
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
		},
		rules: {
			"react/jsx-uses-react": "off",
			"react/react-in-jsx-scope": "off",
			"react/jsx-uses-vars": "error",
			"react/jsx-no-undef": "error",
			"react/jsx-no-useless-fragment": "error",
			"@typescript-eslint/restrict-template-expressions": "off",
			"@typescript-eslint/no-namespace": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
		},
	},
);
