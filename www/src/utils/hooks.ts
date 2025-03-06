import {
	editor,
	Uri,
	type IDisposable,
} from "monaco-editor/esm/vs/editor/editor.api";
import { useEffect, useRef, type DependencyList } from "react";

export function useDisposableRef() {
	const disposable = useRef<IDisposable | null>(null);
	return disposable;
}

interface UseOnModelChangeEffectProps {
	uri: string;
	listener: Parameters<editor.ITextModel["onDidChangeOptions"]>[0];
}

export function useOnModelConfigChangeEffect(
	{ uri, listener }: UseOnModelChangeEffectProps,
	deps: DependencyList,
): void {
	useEffect(() => {
		const model = editor.getModel(Uri.parse(uri));
		if (model) {
			const subscriber = model.onDidChangeOptions(listener);
			return () => {
				subscriber.dispose();
			};
		}
	}, [uri, listener, ...deps]);

	return;
}
