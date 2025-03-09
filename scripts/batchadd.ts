import { z } from "zod";
import { schema } from "./schema";
import * as path from "path";
import { ulid } from "ulid";
import { createInterface } from "readline/promises";

async function getCodeFromPaper(pdfpath: string): Promise<string> {
	const proc = await Bun.$`node ${path.join(__dirname, "./pdfread.mjs")} ${pdfpath}`.nothrow();
	if (proc.exitCode !== 0) {
		await Bun.write("error.log", proc.stderr.toString());
		throw new Error("Error reading pdf, dumped to error.log");
	}
	let code = proc.stdout.toString().trim();
	return code.length === 7 && code.startsWith("P")
		? code
		: await zodInput("Failed to detect code automatically\nPaper code: ", schema.element.shape.code);
}

type Paper = z.infer<typeof schema>[number];

const rl = createInterface({
	input: process.stdin,
	output: process.stdout,
});

const level = "gcse";
const urls: [
	string, // paper url
	string, // ms url
	null | number, // paper number
	null | "higher" | "foundation", // difficulty
	null | number, // year
	null | z.infer<typeof schema.element.shape.subject>, // subject
][] = [
	[
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ECH311ch0-1f-que-20230523.pdf",
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ECH321ch0-1f-rms-20230824.pdf",
		1, "foundation", 2023, "chem-s",
	],
	[
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ECH331ch0-1h-que-20230523.pdf",
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ECH341ch0-1h-rms-20230824.pdf",
		1, "higher", 2023, "chem-s",
	],
	[
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ECH351ch0-2f-que-20230614.pdf",
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ECH361ch0-2f-rms-20230824.pdf",
		2, "foundation", 2023, "chem-s",
	],
	[
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ECH371ch0-2h-que-20230614.pdf",
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ECH381ch0-2h-rms-20230824.pdf",
		2, "higher", 2023, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1ch0-1f-que-20220528.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1ch0-1f-rms-20220825.pdf",
		1, "foundation", 2022, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1ch0-1h-que-20220528.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1ch0-1h-rms-20220825.pdf",
		1, "higher", 2022, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1ch0-2f-que-20220621.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1ch0-2f-rms-20220825.pdf",
		2, "foundation", 2022, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1ch0-2h-que-20220621.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1ch0-2h-rms-20220825.pdf",
		2, "higher", 2022, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_1F_que_20211120.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_1F_rms_20220224.pdf",
		1, "foundation", 2021, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_1H_que_20211120.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_1H_rms_20220224.pdf",
		1, "higher", 2021, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_2F_que_20211130.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_2F_rms_20220224.pdf",
		2, "foundation", 2021, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_2H_que_20211130.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_2H_rms_20220224.pdf",
		2, "higher", 2021, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_1F_que_20201111.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_1F_msc_20210211.pdf",
		1, "foundation", 2020, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_1H_que_20201111.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_1H_msc_20210211.pdf",
		1, "higher", 2020, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_2F_que_20201121.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_2F_msc_20210211.pdf",
		2, "foundation", 2020, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_2H_que_20201121.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_2H_msc_20210211.pdf",
		2, "higher", 2020, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_1F_que_20190517.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_1F_rms_20190822.pdf",
		1, "foundation", 2019, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_1H_que_20190517.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_1H_rms_20190822.pdf",
		1, "higher", 2019, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_2F_que_20190613.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_2F_rms_20190822_0.pdf",
		2, "foundation", 2019, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_2H_que_20190613.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_2H_rms_20190822.pdf",
		2, "higher", 2019, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_1F_Exam-paper_20180517.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_1F_Mark-Scheme_20180822.pdf",
			1, "foundation", 2018, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_1H_Exam-paper_20180517.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_1H_Mark-Scheme_20180822.pdf",
		1, "higher", 2018, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_2F_Exam-paper_20180614.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_2F_Mark-Scheme_20180822.pdf",
		2, "foundation", 2018, "chem-s",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_2H_Exam-paper_20180614.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1CH0_2H_Mark-Scheme_20180822.pdf",
		2, "higher", 2018, "chem-s",
	],
];

// TODO fix P67066A paper 2 not 1
// fix P62071A foundation not higher

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
	coercer: (e: any) => any = (e) => e,
): Promise<z.infer<T>> {
	return input(prompt, (data) => {
		const coerced = coercer(data);
		const res = schema.safeParse(coerced);
		if (res.success) return { success: true, data: coerced };
		return { success: false, data: res.error.errors[0].message };
	});
}
const papers: { papers: z.infer<typeof schema> } = await Bun.file(path.join(__dirname, "../public/papers.json")).json();

async function addpaper(
	paperurl: string,
	msurl: string,
	papernum: null | number = null,
	diff: null | "higher" | "foundation" = "higher",
	year: null | number = 2023,
	subject: null | (typeof papers)["papers"][number]["subject"] = null,
	board: (typeof papers)["papers"][number]["board"] = "edexcel",
) {
	const mspdf = await fetch(msurl).then((r) => r.blob());
	const paperpdf = await fetch(paperurl).then((r) => r.blob());

	const paperId = ulid();
	console.log("Writing with id", paperId);

	await Bun.write(path.join(__dirname, "../public/papers", `${paperId}-ms.pdf`), mspdf);
	await Bun.write(path.join(__dirname, "../public/papers", `${paperId}-paper.pdf`), paperpdf);

	// $`start ${path.join(__dirname, "../public/papers", `${paperId}-ms.pdf`)}`;
	// we love hardcoded urls 
	console.log("\nPlease open in your browser: http://192.168.0.4:5173/papers/" + paperId + "-paper.pdf\n");

	let code: string;
	try {
		code = await getCodeFromPaper(`../public/papers/${paperId}-paper.pdf`);
		console.log("Detected paper code as", code);
	} catch (e) {
		console.error("Error getting code from paper", e);
		code = await zodInput("Paper code: ", schema.element.shape.code);
	}

	const paper: Paper = {
		code,
		year: year ?? (await zodInput("Year: ", schema.element.shape.year, Number)),
		difficulty: diff ?? (await zodInput("Difficulty [higher,foundation,na]: ", schema.element.shape.difficulty)),
		// level: await zodInput("Level [gcse]: ", schema.element.shape.level),
		level,
		// subject: await zodInput("Subject: ", schema.element.shape.subject),
		subject: subject ?? (await zodInput("Subject: ", schema.element.shape.subject)),
		// board: await zodInput("Board: ", schema.element.shape.board),
		board,
		paper:
			papernum ?? (await zodInput("Paper number (e.g. paper 1, paper 2): ", schema.element.shape.paper, Number)),
		paperpdfUrl: paperurl,
		mspdfUrl: msurl,
		paperpdf: "/papers/" + paperId + "-paper.pdf",
		mspdf: "/papers/" + paperId + "-ms.pdf",
		uid: paperId,
	};

	papers.papers.push(paper);

	console.log("Paper added!");
	await Bun.write(path.join(__dirname, "../public/papers.json"), JSON.stringify(papers, null, "\t"));
}

for (const paper of urls) {
	await addpaper(...paper);
}

await Bun.write(path.join(__dirname, "../public/papers.json"), JSON.stringify(papers, null, "\t"));
rl.close();
