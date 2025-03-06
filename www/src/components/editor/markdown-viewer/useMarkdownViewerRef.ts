import { useEffect, useRef } from "react";

interface UseMarkdownViewerRefProps {
	show?: boolean;
}

/**
 * Custom hook that manages a reference to a Markdown viewer element and sets up
 * communication with a Markdown transformer using a MessageChannel.
 * @param {Object} props - The properties object.
 * @param {boolean} props.show - A flag indicating whether the Markdown viewer should be shown.
 * @returns {React.RefObject<HTMLDivElement>} - A reference to the Markdown viewer element.
 *
 * @example
 * const markdownViewerRef = useMarkdownViewerRef({ show: true });
 *
 * @remarks
 * This hook sets up a MessageChannel to communicate with a Markdown transformer.
 * It listens for messages on port2 of the channel and updates the innerHTML of the
 * referenced element based on the messages received. It also notifies the transformer
 * that the viewer is ready by posting a message with port1.
 *
 * The hook cleans up the MessageChannel when the component is unmounted or when the
 * `show` flag changes to `false`.
 */
export function useMarkdownViewerRef({
	show,
}: UseMarkdownViewerRefProps): React.RefObject<HTMLDivElement> {
	const messageChannelRef = useRef<MessageChannel | null>(null);
	const elementRef = useRef<HTMLDivElement>(null);
	const decoder = useRef(new TextDecoder("utf-8"));

	useEffect(() => {
		if (!show) return;
		messageChannelRef.current = new MessageChannel();
		const channel = messageChannelRef.current;

		return () => {
			channel.port1.close();
			channel.port2.close();
			messageChannelRef.current = null;
		};
	}, [show]);

	// Listen on port2 for messages from the markdown transformer
	useEffect(() => {
		if (!show) return;
		const port2 = messageChannelRef.current?.port2;
		if (!port2) return;
		port2.onmessage = (
			event: MessageEvent<Playground.editor.MarkdownTransformerResponse>,
		) => {
			if (!elementRef.current) return;
			const { action } = event.data;
			switch (action) {
				case "processed":
					const { value: result } = event.data;
					elementRef.current.innerHTML =
						decoder.current.decode(result);
					break;
				case "error":
					console.error(
						"Markdown processing error:",
						event.data.value,
					);
					elementRef.current.innerHTML = `<pre>${event.data.value.message}</pre>`;
					break;
				default:
					break;
			}
		};

		port2.onmessageerror = (event) => {
			console.error("Markdown processing error:", event);
			const elem = elementRef.current;
			if (!elem) return;
			elem.innerHTML = `<pre>${event}</pre>`;
		};

		return () => {
			port2.onmessage = null;
			port2.onmessageerror = null;
		};
	}, [show]);

	// Notify the markdown transformer that the viewer is ready,
	// passing port1 to the transformer to communicate back
	useEffect(() => {
		if (!show) return;
		const port1 = messageChannelRef.current?.port1;
		if (!port1) return;
		document.defaultView?.postMessage(
			{ action: "ready" } as Playground.editor.MarkdownTransformerReady,
			{
				targetOrigin: "*",
				transfer: [port1],
			},
		);

		return () => {
			port1.close();
		};
	}, [show]);

	return elementRef;
}
