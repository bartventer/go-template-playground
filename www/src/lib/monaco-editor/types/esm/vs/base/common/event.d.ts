declare module "monaco-editor/esm/vs/base/common/event" {
	import { IDisposable } from "monaco-editor/esm/vs/base/common/lifecycle";
	import { DisposableStore } from "monaco-editor/esm/vs/base/common/lifecycle";

	/**
	 * An event with zero or one parameters that can be subscribed to. The event is a function itself.
	 */
	export interface Event<T> {
		(
			listener: (e: T) => unknown,
			thisArgs?: unknown,
			disposables?: IDisposable[] | DisposableStore,
		): IDisposable;
	}

	export declare class Emitter<T> {
		private readonly _options?;
		private readonly _leakageMon?;
		private readonly _perfMon?;
		private _disposed?;
		private _event?;
		protected _listeners?: ListenerOrListeners<T>;
		private _deliveryQueue?;
		protected _size: number;
		constructor(options?: EmitterOptions);
		dispose(): void;
		get event(): Event<T>;
		private _removeListener;
		private _deliver;
		private _deliverQueue;
		fire(event: T): void;
		hasListeners(): boolean;
	}
}
