import { z } from "zod";
import { schema } from "./schema";
import * as path from "path";
import { ulid } from "ulid";
import { createInterface } from "readline/promises";

type Paper = z.infer<typeof schema>[number];

const rl = createInterface({
	input: process.stdin,
	output: process.stdout,
});

function input(
	prompt: string,
	validator: (data: string) => { success: boolean; data: any } = (data) => ({
		success: true,
		data,
	}),
): Promise<string> {
	return new Promise((resolve, reject) => {
		rl.question(prompt).then((data) => {
			const str = data.toString().trim();
			const res = validator(str);
			if (res.success !== true) {
				console.log(res);
				// try again
				input(prompt, validator).then(resolve).catch(reject);
				return;
			} else {
				resolve(res.data);
			}
		});
	});
}

function zodInput<T extends z.ZodType>(
	prompt: string,
	schema: T,
	coercer: (e: string) => z.infer<T> = (e) => e,
): Promise<z.infer<T>> {
	return input(prompt, (data) => {
		const coerced = coercer(data);
		const res = schema.safeParse(coerced);
		if (res.success) return { success: true, data: coerced };
		return { success: false, data: res.error.errors[0].message };
	});
}

function coerceOptional(e: string) {
	if (e.trim() === "") return undefined;
	return e;
}

const mspdfUrl = await zodInput("Mark Scheme PDF URL: ", schema.element.shape.mspdfUrl);
const paperpdfUrl = await zodInput("Paper PDF URL: ", schema.element.shape.paperpdfUrl);
const inspdfUrl = await zodInput("Insert PDF URL (optional): ", schema.element.shape.inspdfUrl, coerceOptional).catch(() => null);

const mspdf = await fetch(mspdfUrl).then((r) => r.blob());
const paperpdf = await fetch(paperpdfUrl).then((r) => r.blob());
let inspdf: Blob | null = null;
if (inspdfUrl) {
	inspdf = await fetch(inspdfUrl).then((r) => r.blob());
} else {
	console.log("Skipping insert as it was not provided");
}
	

const paperId = ulid();
console.log("Writing with id", paperId);

await Bun.write(path.join(__dirname, "../public/papers", `${paperId}-ms.pdf`), mspdf);
await Bun.write(path.join(__dirname, "../public/papers", `${paperId}-paper.pdf`), paperpdf);
if (inspdf) {
	await Bun.write(path.join(__dirname, "../public/papers", `${paperId}-ins.pdf`), inspdf);
}

const paper: Paper = {
	code: await zodInput("Paper code: ", schema.element.shape.code),
	year: await zodInput("Year: ", schema.element.shape.year, Number),
	difficulty: await zodInput("Difficulty [higher,foundation,na]: ", schema.element.shape.difficulty),
	level: await zodInput("Level [gcse]: ", schema.element.shape.level),
	subject: await zodInput("Subject: ", schema.element.shape.subject),
	board: await zodInput("Board: ", schema.element.shape.board),
	paper: await zodInput("Paper number (e.g. paper 1, paper 2): ", schema.element.shape.paper, Number),
	paperpdfUrl,
	mspdfUrl,
	inspdfUrl: inspdfUrl || undefined,
	paperpdf: "/papers/" + paperId + "-paper.pdf",
	mspdf: "/papers/" + paperId + "-ms.pdf",
	inspdf: inspdf ? "/papers/" + paperId + "-ins.pdf" : undefined,
	uid: paperId,
};

const papers: { papers: z.infer<typeof schema> } = await Bun.file(path.join(__dirname, "../public/papers.json")).json();

papers.papers.push(paper);

await Bun.write(path.join(__dirname, "../public/papers.json"), JSON.stringify(papers, null, "\t"));

console.log("Paper added!");
rl.close();
