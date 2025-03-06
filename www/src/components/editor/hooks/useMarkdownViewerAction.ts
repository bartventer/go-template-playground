import { atomWithHashSet } from "@atoms";
import { CodeLanguages } from "@lib/monaco-editor/languages";
import { useMonacoReadyAtomValue } from "@state";
import { useDisposableRef } from "@utils/hooks";
import { useAtomValue } from "jotai";
import { useAtomCallback } from "jotai/utils";
import {
	editor,
	KeyCode,
	KeyMod,
} from "monaco-editor/esm/vs/editor/editor.api";
import {
	startTransition,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useEditorInstance } from "../editor-provider";
import { EditorAction, EditorContextKey } from "../constants";
import { useEditorAction } from "./useEditorAction";

const MARKDOWN_LANGUAGE_EXPRESSION =
	`${EditorContextKey.EditorLanguageId} == '${CodeLanguages.Markdown}'` as const;

interface UseMarkdownViewerProps {
	onShow?: () => void;
	onHide?: () => void;
}

interface UseMarkdownViewerReturn {
	/** Whether the markdown viewer is open */
	isOpen: boolean;
	/** Actions for markdown viewer */
	actions: {
		/** Show markdown preview */
		show: () => void;
		/** Hide markdown preview */
		hide: () => void;
	};
}

/**
 * Custom hook to manage the visibility and actions of a Markdown viewer within an editor instance.
 */
export function useMarkdownViewerAction({
	onShow,
	onHide,
}: UseMarkdownViewerProps): UseMarkdownViewerReturn {
	const instance = useEditorInstance();
	const [isOpen, setIsOpen] = useState(false);
	const isMonacoReady = useMonacoReadyAtomValue();
	const isSupported = useIsMarkdownViewerSupported();
	const visibilityConditionRef = useRef<editor.IContextKey<boolean> | null>(
		null,
	);
	const actionRef = useDisposableRef();
	const onDidChangeModelRef = useDisposableRef();
	const onDidChangeModelLanguageRef = useDisposableRef();
	const isMounted = useRef(false);

	const show = useEditorAction(instance, EditorAction.PreviewMarkdown);

	const hide = useCallback(() => {
		visibilityConditionRef.current?.set(false);
		setIsOpen(false);
		onHide?.();
	}, [onHide]);

	const updateSupport: (props: { value: boolean; uri?: string }) => void =
		useAtomCallback(
			useCallback((_get, set, props) => {
				if (!props.uri) return;
				if (props.value) {
					set(addSupportedAtom, props.uri);
				} else {
					set(removeSupportedAtom, props.uri);
				}
			}, []),
		);

	// Effect to:
	// - Register markdown preview action
	// - Update support for markdown files
	useEffect(() => {
		if (!isMonacoReady || !instance?.getModel()) {
			return;
		}

		if (!visibilityConditionRef.current) {
			visibilityConditionRef.current = instance.createContextKey<boolean>(
				EditorContextKey.MarkdownPreviewVisible,
				false,
			);
		}

		actionRef.current = instance.addAction({
			id: EditorAction.PreviewMarkdown,
			label: "Markdown: Preview",
			keybindings: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyV],
			contextMenuGroupId: "navigation",
			contextMenuOrder: 1,
			precondition: MARKDOWN_LANGUAGE_EXPRESSION,
			keybindingContext: `!${EditorContextKey.MarkdownPreviewVisible}`,
			run: (codeEditor) => {
				if (!codeEditor.getModel()) return;
				visibilityConditionRef.current?.set(true);
				setIsOpen(true);
				onShow?.();
			},
		});

		const checkSupport = (e: typeof instance) =>
			Boolean(e.getAction(EditorAction.PreviewMarkdown)?.isSupported());

		onDidChangeModelRef.current = instance.onDidChangeModel((e) => {
			startTransition(() => {
				updateSupport({
					value: checkSupport(instance),
					uri: e.newModelUrl?.toString(),
				});
			});
		});

		onDidChangeModelLanguageRef.current = instance.onDidChangeModelLanguage(
			() => {
				startTransition(() => {
					updateSupport({
						value: checkSupport(instance),
						uri: instance.getModel()?.uri.toString(),
					});
				});
			},
		);

		// Initial mount
		if (!isMounted.current) {
			updateSupport({
				value: checkSupport(instance),
				uri: instance.getModel()?.uri.toString(),
			});
			isMounted.current = true;
		}

		return () => {
			visibilityConditionRef.current?.reset();
			actionRef.current?.dispose();
			onDidChangeModelRef.current?.dispose();
			onDidChangeModelLanguageRef.current?.dispose();
		};
	}, [isMonacoReady, instance, onShow, updateSupport]);

	// Close preview when no markdown files are supported
	useEffect(() => {
		if (!isMounted.current) return;
		if (isSupported.size === 0) {
			setIsOpen(false);
		}
	}, [isSupported.size]);

	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	const actions = useMemo<UseMarkdownViewerReturn["actions"]>(
		() => ({ show, hide }),
		[show, hide],
	);

	return {
		isOpen,
		actions,
	};
}

const [isSupportedAtom, addSupportedAtom, removeSupportedAtom] =
	atomWithHashSet<string>({
		debugLabel: "md-viewer-supported",
	});

export function useIsMarkdownViewerSupported() {
	return useAtomValue(isSupportedAtom);
}
