/**
 * @file WASM worker script for the Playground.
 *
 * This script is responsible for processing templates and transforming data.
 * It listens for messages from the main thread and processes the data using
 * the WebAssembly module.
 */

import { GoWasmLoaderService } from "../services/wasm/GoWasmLoaderService";
import wasmUrl from "/wasm/playground.wasm.gz?url";

const loader = new GoWasmLoaderService(wasmUrl);

loader
	.init()
	.then(() => {
		postMessage({
			action: "wasmReady",
		} satisfies Playground.WasmReadyResult);
	})
	.catch((error) => {
		console.error(
			`Unexpected error while loading WebAssembly module: ${error instanceof Error ? error.message : String(error)}`,
		);
		self.close();
	});

onmessage = (event: MessageEvent<Playground.Request>) => {
	const { action, payload } = event.data;

	try {
		let result;

		switch (action) {
			case "processTemplate":
				result = processTemplate(...payload);
				break;
			case "transformData":
				result = transformData(...payload);
				break;
			default:
				console.error(`Unknown action: ${action}`);
				return;
		}

		if ("data" in result) {
			postMessage(
				{
					action: action,
					data: result.data,
				} satisfies Playground.SuccessResult,
				[result.data.buffer],
			);
		} else {
			postMessage({
				action: action,
				error: result.error,
			} satisfies Playground.ErrorResult);
		}
	} catch (error) {
		postMessage({
			action: action,
			error: `Unexpected error while processing request: ${error instanceof Error ? error.message : String(error)}`,
		} satisfies Playground.ErrorResult);
	}
};
