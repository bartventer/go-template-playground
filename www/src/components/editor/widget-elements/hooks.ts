import { useToast } from "@chakra-ui/react";
import { EditorAction } from "@components/editor/constants";
import { useEditorAction } from "../hooks";
import { filenameFromUri, textModelFilesByUri } from "@components/editor/data";
import { useMonacoReadyAtomValue } from "@state";
import { useDisposableRef } from "@utils/hooks";
import { editor, languages, Uri } from "monaco-editor/esm/vs/editor/editor.api";
import {
	type SyntheticEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { useEditorApi } from "../editor-provider";

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB

type ClickEventHandler = (e: SyntheticEvent) => void;
type UseCopyToClipboardReturn = [onClick: ClickEventHandler];

export function useCopyToClipboard(): UseCopyToClipboardReturn {
	const toast = useToast();
	const editorApi = useEditorApi();
	const instance = editorApi.useInstance();

	const selectAll = useEditorAction(instance, EditorAction.SelectAll);

	const copyToClipboard = useEditorAction(
		instance,
		EditorAction.ClipboardCopy,
	);

	const onClick = useCallback<ClickEventHandler>(
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			try {
				selectAll();
				copyToClipboard();
				toast({
					title: "Copied to clipboard",
					description:
						"The content has been copied to the clipboard.",
					status: "success",
					isClosable: true,
				});
			} catch (error) {
				toast({
					title: "Failed to copy to clipboard",
					description: error instanceof Error ? error.message : "",
					status: "error",
					isClosable: true,
				});
			}
		},
		[selectAll, copyToClipboard],
	);

	return [onClick] as const;
}

type UseEditorLanguageReturn = ReturnType<typeof useEditorLanguage>;

/**
 * Custom hook to get the language of the editor model based on the provided path. It will
 * run when the monaco editor is ready and the model is available.
 */
function useEditorLanguage({ path }: Playground.editor.PropsWithModelPath) {
	const disposable = useDisposableRef();
	const [language, setLanguage] =
		useState<languages.ILanguageExtensionPoint>();
	const mounted = useRef(false);
	const isMonacoReady = useMonacoReadyAtomValue();

	useEffect(() => {
		if (!isMonacoReady) return;
		const model = editor.getModel(Uri.parse(path));
		if (!model) return;
		disposable.current = model.onDidChangeLanguage((e) => {
			setLanguage(
				languages.getLanguages().find((l) => l.id === e.newLanguage),
			);
		});
		if (!mounted.current) {
			setLanguage(
				languages
					.getLanguages()
					.find((l) => l.id === model.getLanguageId()),
			);
			mounted.current = true;
		}
		return () => {
			disposable.current?.dispose();
			mounted.current = false;
		};
	}, [path, isMonacoReady]);

	return language;
}

export type UseFileUploadProps = Playground.editor.PropsWithModelPath;

type UseFileUploadReturn = [
	onClick: ClickEventHandler,
	language: UseEditorLanguageReturn,
];

export function useFileUpload({
	path,
}: UseFileUploadProps): UseFileUploadReturn {
	const editorApi = useEditorApi();
	const instance = editorApi.useInstance();
	const language = useEditorLanguage({ path });
	const toast = useToast();
	const onClick = useCallback<ClickEventHandler>(
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			if (!language) return;
			const input = document.createElement("input");
			input.type = "file";
			input.accept = language.extensions?.join(",") ?? "";
			input.onchange = (e) => {
				const file = (e.target as HTMLInputElement).files?.[0];
				if (!file) return;
				if (file.size > FILE_SIZE_LIMIT) {
					toast({
						title: "File is too large",
						description: "Please upload a file less than 5MB.",
						status: "error",
						isClosable: true,
					});
					return;
				}
				const reader = new FileReader();
				reader.onload = (e) => {
					const text = e.target?.result as string;
					try {
						instance?.setValue(text);
						toast({
							title: "File uploaded",
							description:
								"The file has been uploaded successfully.",
							status: "success",
							isClosable: true,
						});
					} catch (error) {
						toast({
							title: "Failed to upload file",
							description:
								error instanceof Error ? error.message : "",
							status: "error",
							isClosable: true,
						});
					}
				};
				reader.readAsText(file);
				reader.onloadend = () => {
					input.remove();
				};
			};
			input.click();
		},
		[language, instance, toast],
	);

	return [onClick, language] as const;
}

export type UseFileDownloadProps = Playground.editor.PropsWithModelPath;

type UseFileDownloadReturn = [
	onClick: ClickEventHandler,
	language: UseEditorLanguageReturn,
];

export function useFileDownload({
	path,
}: UseFileDownloadProps): UseFileDownloadReturn {
	const editorApi = useEditorApi();
	const instance = editorApi.useInstance();
	const language = useEditorLanguage({ path });
	const toast = useToast();
	const errorToast = useCallback(
		(description: string) => {
			toast({
				title: "Failed to download file",
				description: description,
				status: "error",
				isClosable: true,
			});
		},
		[toast],
	);

	const onClick = useCallback<ClickEventHandler>(
		(e) => {
			try {
				e.preventDefault();
				e.stopPropagation();
				if (!language) {
					errorToast("Language not found.");
					return;
				}
				if (!instance) {
					errorToast("Editor instance not found.");
					return;
				}
				const blob = new Blob([instance.getValue() ?? ""], {
					type: language.mimetypes?.[0] ?? "text/plain",
				});
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;

				const file = textModelFilesByUri.get(path);
				if (!file) {
					errorToast("File not found.");
					return;
				}
				const extension = language.extensions?.[0] ?? "txt";
				const filename = filenameFromUri({
					uri: Uri.parse(path),
					suffixFn: ({ hasExtension }) =>
						!hasExtension ? `.${extension}` : "",
				});
				a.download = filename;
				a.click();
				URL.revokeObjectURL(url);
			} catch (error) {
				errorToast(
					error instanceof Error
						? error.message
						: "An unexpected error occurred.",
				);
			}
		},
		[path, language, instance, errorToast],
	);

	return [onClick, language] as const;
}
