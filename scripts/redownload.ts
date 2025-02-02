import { Schema } from "./schema";
import * as path from "path";

const papers: { papers: Schema } = await Bun.file(path.join(__dirname, "../public/papers.json")).json();

// Redownload all papers
for (const paper of papers.papers) {
	const mspdf = await fetch(paper.mspdfUrl).then((r) => r.blob());
	const paperpdf = await fetch(paper.paperpdfUrl).then((r) => r.blob());

	await Bun.write(path.join(__dirname, "../public/papers", `${paper.uid}-ms.pdf`), mspdf);
	await Bun.write(path.join(__dirname, "../public/papers", `${paper.uid}-paper.pdf`), paperpdf);
}
