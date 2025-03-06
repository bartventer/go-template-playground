import {
	atomWithEditorPreference,
	atomWithNativeEditorPreferenceAndListener,
	atomWithToggleableCustomEditorPreference,
	atomWithToggleableNativeEditorPreferenceAndListener,
} from "@atoms";
import { VsTheme } from "@components/editor/constants";
import { debugAtoms, privatizeAtoms } from "@utils/atoms";
import {
	atom,
	useAtom,
	useAtomValue,
	useSetAtom,
	type ExtractAtomValue,
} from "jotai";
import { atomEffect } from "jotai-effect";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import type { BuiltinTheme } from "monaco-editor/esm/vs/editor/standalone/common/standaloneTheme";
import { useCallback } from "react";

const highContrastAtom = atomWithEditorPreference("highContrast");
const [themeAtom, useThemePreferenceListener] =
	atomWithNativeEditorPreferenceAndListener("theme");

/**
 * Resolves the appropriate theme based on the high contrast mode and the theme
 * preference.
 */
function resolveTheme(
	highContrast: boolean,
	theme?: BuiltinTheme,
): BuiltinTheme {
	if (highContrast) {
		switch (theme) {
			case VsTheme.Vs:
				return VsTheme.HcLight;
			case VsTheme.VsDark:
				return VsTheme.HcDark;
			default:
				break;
		}
	} else {
		switch (theme) {
			case VsTheme.HcLight:
				return VsTheme.Vs;
			case VsTheme.HcDark:
				return VsTheme.VsDark;
			default:
				break;
		}
	}
	return (
		theme ??
		(window.matchMedia("(prefers-color-scheme: dark)").matches
			? resolveTheme(highContrast, VsTheme.VsDark)
			: resolveTheme(highContrast, VsTheme.Vs))
	);
}

const themePreferenceEffect = atomEffect((get, set) => {
	const highContrast = get.peek(highContrastAtom); // Peek to avoid circular dependency
	const theme = get(themeAtom); // Subscribe to themeAtom
	set(themeAtom, resolveTheme(highContrast, theme));
});

const highContrastPreferenceEffect = atomEffect((get, set) => {
	const theme = get.peek(themeAtom); // Peek to avoid circular dependency
	const highContrast = get(highContrastAtom); // Subscribe to highContrastAtom
	set(themeAtom, resolveTheme(highContrast, theme));
});

/** Normalized theme for non-high contrast themes */
const normalizedThemeAtom = atom((get) => {
	const value = get(themeAtom);
	switch (value) {
		case VsTheme.HcLight:
			return VsTheme.Vs;
		case VsTheme.HcDark:
			return VsTheme.VsDark;
		default:
			return value;
	}
});

privatizeAtoms(themePreferenceEffect, highContrastPreferenceEffect);

const [cursorBlinkingAtom, useCursorBlinkingPreferenceListener] =
	atomWithNativeEditorPreferenceAndListener("cursorBlinking");
const [tabCompletionAtom, useTabCompletionPreferenceListener] =
	atomWithNativeEditorPreferenceAndListener("tabCompletion");
const [wordWrapAtom, useWordWrapPreferenceListener] =
	atomWithNativeEditorPreferenceAndListener("wordWrap");
const [lineNumbersAtom, useLineNumbersPreferenceListener] =
	atomWithNativeEditorPreferenceAndListener("lineNumbers");
const [minimapAtom, useMinimapPreferenceListener] =
	atomWithNativeEditorPreferenceAndListener("minimap");

const isSmallScreenAtom = atom<boolean>(false);
const isSmallScreenEffect = atomEffect((_get, set) => {
	const handleResize = () => {
		set(isSmallScreenAtom, window.innerWidth < 768);
	};

	window.addEventListener("resize", handleResize);
	handleResize(); // Initial call
	return () => {
		window.removeEventListener("resize", handleResize);
	};
});
privatizeAtoms(isSmallScreenEffect);

/** Override minimap preference for small screens. Null means no override. */
const minimapOverrideAtom = atom<ExtractAtomValue<typeof minimapAtom> | null>(
	null,
);

const fullScreenAtom = atomWithToggleableCustomEditorPreference("fullScreen");
const [smoothScrollingAtom, useSmoothScrollingPreferenceListener] =
	atomWithToggleableNativeEditorPreferenceAndListener("smoothScrolling");
const [contextmenuAtom, useContextmenuPreferenceListener] =
	atomWithToggleableNativeEditorPreferenceAndListener("contextmenu");

// Hooks
export const useEditorHighContrastPreferenceAtom = () =>
	useAtom(highContrastAtom);
export const useEditorThemePreferenceAtomValue = () => useAtomValue(themeAtom);
export const useSetEditorThemePreferenceAtom = () => useSetAtom(themeAtom);
export const useEditorNormalizedThemeAtomValue = () =>
	useAtomValue(normalizedThemeAtom);
export const useEditorCursorBlinkingPreferenceAtom = () =>
	useAtom(cursorBlinkingAtom);
export const useEditorTabCompletionPreferenceAtom = () =>
	useAtom(tabCompletionAtom);
export const useEditorWordWrapPreferenceAtom = () => useAtom(wordWrapAtom);
export const useEditorLineNumbersPreferenceAtom = () =>
	useAtom(lineNumbersAtom);

export const useEditorFullScreenPreferenceAtom = () => useAtom(fullScreenAtom);
export const useEditorFullScreenPreferenceAtomValue = () =>
	useAtomValue(fullScreenAtom);
export const useEditorSmoothScrollingPreferenceAtom = () =>
	useAtom(smoothScrollingAtom);
export const useEditorContextmenuPreferenceAtom = () =>
	useAtom(contextmenuAtom);
export const useEditorMinimapPreferenceAtom = () => useAtom(minimapAtom);
export const useEditorMinimapPreferenceOverrideAtomValue = () =>
	useAtomValue(minimapOverrideAtom);
export const useIsSmallScreenAtomValue = () => useAtomValue(isSmallScreenAtom);

export const useEditorPreferencesListener = () => {
	// Mount effects
	useAtom(themePreferenceEffect);
	useAtom(highContrastPreferenceEffect);
	useAtom(isSmallScreenEffect);

	// Change listeners
	useThemePreferenceListener(
		useCallback(
			() =>
				(_get, _set, { nextValue }) => {
					if (!nextValue) return;
					editor.setTheme(nextValue);
				},
			[],
		),
	);
	useCursorBlinkingPreferenceListener();
	useTabCompletionPreferenceListener();
	useSmoothScrollingPreferenceListener();
	useContextmenuPreferenceListener();
	useWordWrapPreferenceListener();
	useLineNumbersPreferenceListener();
	useMinimapPreferenceListener(
		useCallback(
			(codeEditor) =>
				(get, _set, { nextValue }) => {
					codeEditor.updateOptions({
						minimap: {
							enabled: get(isSmallScreenAtom) ? false : nextValue,
						},
					});
				},
			[],
		),
	);
};

export const editorPreferencesAtom = atom<
	editor.IEditorOptions & editor.IGlobalEditorOptions
>((get) => ({
	theme: get(themeAtom),
	smoothScrolling: get(smoothScrollingAtom),
	contextmenu: get(contextmenuAtom),
	cursorBlinking: get(cursorBlinkingAtom),
	tabCompletion: get(tabCompletionAtom),
	wordWrap: get(wordWrapAtom),
	lineNumbers: get(lineNumbersAtom),
	minimap: {
		enabled: get(isSmallScreenAtom) ? false : get(minimapAtom),
	},
}));

debugAtoms([editorPreferencesAtom, "editorPreferencesAtom"]);
