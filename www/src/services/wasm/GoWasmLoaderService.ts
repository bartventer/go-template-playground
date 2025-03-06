import "@lib/go/wasm_exec";

/** GoWasmLoaderService is a service that loads a Go WebAssembly module. */
export class GoWasmLoaderService {
	#wasmUrl: string;
	#go: Go;

	constructor(wasmUrl: string) {
		this.#wasmUrl = wasmUrl;
		this.#go = new Go();
	}

	async init(): Promise<void> {
		const response = await fetch(this.#wasmUrl, {
			headers: {
				"Content-Type": "application/wasm",
				"Content-Encoding": "gzip",
			},
		});
		if (!response.ok) {
			throw new Error(
				`Network response was not ok: ${response.status} 
				${response.statusText}`,
			);
		}
		const bytes = await response.arrayBuffer();
		const result = await WebAssembly.instantiate(
			bytes,
			this.#go.importObject,
		);

		try {
			this.#go.run(result.instance);
		} catch (error) {
			try {
				this.#go.exit(1);
			} catch (exitError) {
				console.error(
					`Unexpected error while exiting Go WebAssembly module: ${
						exitError instanceof Error
							? exitError.message
							: String(exitError)
					}`,
				);
			}
			throw error;
		}
	}
}
