import { Schema } from "./schema";
import * as path from "path";

const papers: { papers: Schema } = await Bun.file(path.join(__dirname, "../public/papers.json")).json();

// Remove duplicates

const seen = new Set<string>();
const deduped: Schema = [];
for (const paper of papers.papers) {
	const key = `${paper.code}-${paper.year}-${paper.month}-${paper.difficulty}-${paper.level}-${paper.subject}-${paper.board}-${paper.paper}`;
	if (seen.has(key)) continue;
	seen.add(key);
	deduped.push(paper);
}

await Bun.write(path.join(__dirname, "../public/papers.json"), JSON.stringify(papers, null, 2));await Bun.write(path.join(__dirname, "../public/papers.json"), JSON.stringify(papers, null, 2));
