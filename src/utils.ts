import type { Schema } from "../scripts/schema";

export async function loadPapers() {
	return await fetch("/papers.json").then(
		(r) =>
			r.json() as Promise<{
				papers: Schema;
			}>,
	);
}
