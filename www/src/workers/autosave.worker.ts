/**
 * @file Autosave worker script for the Playground.
 *
 * This worker is used to save the editor state to IndexedDB. It listens for
 * messages from the main thread and commits the state to the database.
 */

import { IndexedDBService } from "../services/storage/IndexedDBService";

const idb = new IndexedDBService();

onmessage = async (
	event: MessageEvent<Playground.editor.AutosaveWorkerMessage>,
) => {
	const { key, ...payload } = event.data;

	try {
		await idb.put(key, payload);
	} catch (error) {
		console.error("Autosave error:", error);
	}
};
