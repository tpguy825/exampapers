import { Schema } from "./schema";
import * as path from "path";
import * as fs from "fs/promises";

const papers: { papers: Schema } = await Bun.file(path.join(__dirname, "../public/papers.json")).json();

// Remove all papers that are not in the list from the papers dir
const paperIds = [...papers.papers.map((paper) => paper.paperpdf), ...papers.papers.map((paper) => paper.mspdf)].map(
	(url) => path.join(__dirname, "../public", url),
);
const paperDir = path.join(__dirname, "../public/papers");

const files = await fs.readdir(paperDir);

for (const file of files) {
	if (!paperIds.includes(path.join(paperDir, file))) {
		console.log("Removing", file);
		await fs.unlink(path.join(paperDir, file));
	}
}
