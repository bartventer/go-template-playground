import { useAtomValue, type Atom } from "jotai";
import { atomWithCache } from "jotai-cache";
import { release } from "package.json";

const CACHE_TTL_S = 600;

interface ChangelogResponse {
	body: string;
}

function isChangelogResponse(data: unknown): data is ChangelogResponse {
	return typeof data === "object" && data !== null && "body" in data;
}

async function fetchChangelog() {
	return fetch(
		`/api/repos/${release.owner}/${release.repo}/releases/latest`,
		{
			headers: {
				Accept: "application/vnd.github.v3+json",
			},
		},
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			if (isChangelogResponse(data)) {
				return data.body;
			} else {
				throw new Error("Invalid data received");
			}
		})
		.catch((error) =>
			error instanceof Error
				? error.message
				: "Failed to fetch release notes",
		);
}

const changelogAtom: Atom<Promise<string>> = atomWithCache(fetchChangelog, {
	shouldRemove(createdAt) {
		return Date.now() - createdAt > CACHE_TTL_S * 1000;
	},
});

export const useChangelogAtomValue = () => useAtomValue(changelogAtom);
