const ERROR_MESSAGES = {
	IDB_ERROR: "IndexedDB error",
	STORE_PUT_ERROR: "Store put error",
	STORE_GET_ERROR: "Store get error",
} as const;

/**
 * IndexedDBService implements the {@link Playground.editor.AutoSaver AutoSaver} interface
 * using {@link IDBDatabase IndexedDB} as the storage backend.
 */
export class IndexedDBService implements Playground.editor.AutoSaver {
	static readonly #DB_NAME = "PlaygroundDB";
	static readonly #STORE_NAME = "autosave";
	static readonly #DB_VERSION = 1;
	static readonly #DB_KEY_PATH = "key";

	#db: IDBDatabase | null = null;

	async #openDB(): Promise<IDBDatabase> {
		if (this.#db) return this.#db;

		this.#db = await new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open(
				IndexedDBService.#DB_NAME,
				IndexedDBService.#DB_VERSION,
			);

			request.onupgradeneeded = (event) => {
				const dbInstance = (event.target as IDBOpenDBRequest).result;
				if (
					!dbInstance.objectStoreNames.contains(
						IndexedDBService.#STORE_NAME,
					)
				) {
					dbInstance.createObjectStore(IndexedDBService.#STORE_NAME, {
						keyPath: IndexedDBService.#DB_KEY_PATH,
					});
				}
			};

			request.onsuccess = (event) => {
				resolve((event.target as IDBOpenDBRequest).result);
			};

			request.onerror = (event) => {
				reject(
					new Error(
						(event.target as IDBOpenDBRequest).error?.message ||
							ERROR_MESSAGES.IDB_ERROR,
					),
				);
			};
		});

		return this.#db;
	}

	async put(
		key: Playground.editor.AutoSaveKey,
		data: Playground.editor.AutoSavePayload,
	): Promise<void> {
		const db = await this.#openDB();
		const transaction = db.transaction(
			IndexedDBService.#STORE_NAME,
			"readwrite",
		);
		const store = transaction.objectStore(IndexedDBService.#STORE_NAME);

		await new Promise<void>((resolve, reject) => {
			const request = store.put({
				...data,
				key: key,
			});

			request.onsuccess = () => {
				resolve();
			};

			request.onerror = (event) => {
				reject(
					new Error(
						(event.target as IDBRequest).error?.message ||
							ERROR_MESSAGES.STORE_PUT_ERROR,
					),
				);
			};
		});
	}

	async get(
		key: Playground.editor.AutoSaveKey,
	): Promise<Playground.editor.AutoSavePayload | null> {
		const db = await this.#openDB();
		const transaction = db.transaction(
			IndexedDBService.#STORE_NAME,
			"readonly",
		);
		const store = transaction.objectStore(IndexedDBService.#STORE_NAME);

		return new Promise<Playground.editor.AutoSavePayload | null>(
			(resolve, reject) => {
				const request = store.get(key);

				request.onsuccess = (event) => {
					resolve(
						(event.target as IDBRequest)
							.result as Playground.editor.AutoSavePayload | null,
					);
				};

				request.onerror = (event) => {
					reject(
						new Error(
							(event.target as IDBRequest).error?.message ||
								ERROR_MESSAGES.STORE_GET_ERROR,
						),
					);
				};
			},
		);
	}

	async getAllKeys(): Promise<Playground.editor.AutoSaveKey[]> {
		const db = await this.#openDB();
		const transaction = db.transaction(
			IndexedDBService.#STORE_NAME,
			"readonly",
		);
		const store = transaction.objectStore(IndexedDBService.#STORE_NAME);

		return new Promise<Playground.editor.AutoSaveKey[]>(
			(resolve, reject) => {
				const request = store.getAllKeys();

				request.onsuccess = (event) => {
					resolve(
						(event.target as IDBRequest)
							.result as Playground.editor.AutoSaveKey[],
					);
				};

				request.onerror = (event) => {
					reject(
						new Error(
							(event.target as IDBRequest).error?.message ||
								ERROR_MESSAGES.STORE_GET_ERROR,
						),
					);
				};
			},
		);
	}

	async clear(): Promise<void> {
		const db = await this.#openDB();
		const transaction = db.transaction(
			IndexedDBService.#STORE_NAME,
			"readwrite",
		);
		const store = transaction.objectStore(IndexedDBService.#STORE_NAME);

		await new Promise<void>((resolve, reject) => {
			const request = store.clear();

			request.onsuccess = () => {
				resolve();
			};

			request.onerror = (event) => {
				reject(
					new Error(
						(event.target as IDBRequest).error?.message ||
							ERROR_MESSAGES.STORE_PUT_ERROR,
					),
				);
			};
		});
	}
}
