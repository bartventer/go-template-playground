declare module "monaco-editor/esm/vs/base/common/lifecycle" {
	/**
	 * An object that performs a cleanup operation when `.dispose()` is called.
	 *
	 * Some examples of how disposables are used:
	 *
	 * - An event listener that removes itself when `.dispose()` is called.
	 * - A resource such as a file system watcher that cleans up the resource when `.dispose()` is called.
	 * - The return value from registering a provider. When `.dispose()` is called, the provider is unregistered.
	 */
	export interface IDisposable {
		dispose(): void;
	}
	/**
	 * Abstract base class for a {@link IDisposable disposable} object.
	 *
	 * Subclasses can {@linkcode _register} disposables that will be automatically cleaned up when this object is disposed of.
	 */
	export declare abstract class Disposable implements IDisposable {
		static readonly None: IDisposable;
		protected readonly _store: unknown;
		constructor();
		dispose(): void;
		protected _register<T extends IDisposable>(o: T): T;
	}
	/**
	 * Manages a collection of disposable values.
	 *
	 * This is the preferred way to manage multiple disposables. A `DisposableStore` is safer to work with than an
	 * `IDisposable[]` as it considers edge cases, such as registering the same value multiple times or adding an item to a
	 * store that has already been disposed of.
	 */
	export declare class DisposableStore implements IDisposable {
		static DISABLE_DISPOSED_WARNING: boolean;
		private readonly _toDispose;
		private _isDisposed;
		constructor();
		dispose(): void;
		get isDisposed(): boolean;
		clear(): void;
		add<T extends IDisposable>(o: T): T;
		delete<T extends IDisposable>(o: T): void;
		deleteAndLeak<T extends IDisposable>(o: T): void;
	}
}
