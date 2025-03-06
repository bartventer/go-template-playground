import { useColorMode } from "@chakra-ui/react";
import {
	applyEditorThemeData,
	isEditorThemeDataDefined,
} from "@lib/monaco-editor/helpers";
import { useDisposableRef } from "@utils/hooks";
import type { IStandaloneTheme } from "monaco-editor/esm/vs/editor/standalone/common/standaloneTheme";
import { useCallback, useLayoutEffect, useRef } from "react";
import { AppTheme, isVsLightTheme } from "../constants";
import { useEditorInstance } from "../editor-provider";

/**
 * Custom hook that synchronizes the editor theme with the application theme.
 *
 * This hook listens for changes in the editor's color theme and applies the corresponding
 * theme to the application. It also sets the initial theme when the component mounts.
 */
export function useEditorThemeSyncEffect(): void {
	const appColorMode = useColorMode();
	const instance = useEditorInstance();
	const onDidColorThemeChangeRef = useDisposableRef();
	const isMounted = useRef(false);

	const updateTheme = useCallback(
		(e: IStandaloneTheme) => {
			if (!isEditorThemeDataDefined(e)) return;
			document.body.dataset.vscodeTheme = e.themeName;
			applyEditorThemeData(document.documentElement, e.themeData);
			const normalizedTheme = isVsLightTheme(e.themeName)
				? AppTheme.Light
				: AppTheme.Dark;
			appColorMode.setColorMode(normalizedTheme);
		},
		[appColorMode.setColorMode],
	);

	useLayoutEffect(() => {
		if (!instance?.getModel()) return;

		onDidColorThemeChangeRef.current =
			instance._standaloneThemeService.onDidColorThemeChange((e) => {
				updateTheme(e);
			});

		// Initial theme synchronization
		if (!isMounted.current) {
			updateTheme(instance._standaloneThemeService.getColorTheme());
			isMounted.current = true;
		}

		return () => {
			delete document.body.dataset.vscodeTheme;
			onDidColorThemeChangeRef.current?.dispose();
			isMounted.current = false;
		};
	}, [instance, updateTheme]);

	return;
}
