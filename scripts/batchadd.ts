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
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCF311sc0-1bf-que-20230517.pdf",
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCF321sc0-1bf-rms-20230824.pdf",
		1,
		"foundation",
		2023,
		"bio-c",
	],
	[
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCF331sc0-1cf-que-20230523.pdf",
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCF341sc0-1cf-rms-20230824.pdf",
		1,
		"foundation",
		2023,
		"chem-c",
	],
	[
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCF351sc0-1pf-que-20230526.pdf",
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCF361sc0-1pf-rms-20230824.pdf",
		1,
		"foundation",
		2023,
		"phy-c",
	],
	[
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCF371sc0-2bf-que-20230610.pdf",
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCF381sc0-2bf-rms-20230824.pdf",
		2,
		"foundation",
		2023,
		"bio-c",
	],
	[
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCF391sc0-2cf-que-20230614.pdf",
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCF3101sc0-2cf-rms-20230824.pdf",
		2,
		"foundation",
		2023,
		"chem-c",
	],
	[
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCF3111sc0-2pf-que-20230617.pdf",
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCF3121sc0-2pf-rms-20230824.pdf",
		2,
		"foundation",
		2023,
		"phy-c",
	],
	[
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCH311sc0-1bh-que-20230517.pdf",
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCH321sc0-1bh-rms-20230824.pdf",
		1,
		"higher",
		2023,
		"bio-c",
	],
	[
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCH331sc0-1ch-que-20230523.pdf",
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCH341sc0-1ch-rms-20230824.pdf",
		1,
		"higher",
		2023,
		"chem-c",
	],
	[
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCH351sc0-1ph-que-20230526.pdf",
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCH361sc0-1ph-rms-20230824.pdf",
		1,
		"higher",
		2023,
		"phy-c",
	],
	[
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCH371sc0-2bh-que-20230610.pdf",
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCH381sc0-2bh-rms-20230824.pdf",
		2,
		"higher",
		2023,
		"bio-c",
	],
	[
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCH391sc0-2ch-que-20230614.pdf",
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCH3111sc0-2ch-rms-20230824.pdf",
		2,
		"higher",
		2023,
		"chem-c",
	],
	[
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCH3101sc0-2ph-que-20230617.pdf",
		"https://revisionscience.com/sites/default/files/revisionscience/documents/ESCH3121sc0-2ph-rms-20230824.pdf",
		2,
		"higher",
		2023,
		"phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1bf-que-20220518.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1bf-rms-20220825.pdf",
		1,
		"foundation",
		2022,
		"bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1cf-que-20220528.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1cf-rms-20220825.pdf",
		1,
		"foundation",
		2022,
		"chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1pf-que-20220610.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1pf-rms-20220825.pdf",
		1,
		"foundation",
		2022,
		"phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2bf-que-20220616.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2bf-rms-20220825.pdf",
		2,
		"foundation",
		2022,
		"bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2cf-que-20220621.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2cf-rms-20220825.pdf",
		2,
		"foundation",
		2022,
		"chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2pf-que-20220624.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2pf-rms-20220825.pdf",
		2,
		"foundation",
		2022,
		"phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1bh-que-20220518.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1bh-rms-20220825.pdf",
		1,
		"higher",
		2022,
		"bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1ch-que-20220528.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1ch-rms-20220825.pdf",
		1,
		"higher",
		2022,
		"chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1ph-que-20220610.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1ph-rms-20220825.pdf",
		1,
		"higher",
		2022,
		"phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2bh-que-20220616.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2bh-rms-20220825.pdf",
		2,
		"higher",
		2022,
		"bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2ch-que-20220621.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2ch-rms-20220825.pdf",
		2,
		"higher",
		2022,
		"chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2ph-que-20220624.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2ph-rms-20220825.pdf",
		2,
		"higher",
		2022,
		"phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1BF_que_20211116.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1bf-rms-20220224.pdf",
		1, "foundation", 2021, "bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1BH_que_20211116.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1bh-rms-20220224.pdf",
		1, "higher", 2021, "bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1CF_que_20211120.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1cf-rms-20220224.pdf",
		1, "foundation", 2021, "chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1CH_que_20211120.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1ch-rms-20220224.pdf",
		1, "higher", 2021, "chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1PF_que_20211124.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1pf-rms-20220224.pdf",
		1, "foundation", 2021, "phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1PH_que_20211124.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-1ph-rms-20220224.pdf",
		1, "higher", 2021, "phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2BF_que_20211127.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2bf-rms-20220224.pdf",
		2, "foundation", 2021, "bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2BH_que_20211127.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2bh-rms-20220224.pdf",
		2, "higher", 2021, "bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2CF_que_20211130.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2cf-rms-20220224.pdf",
		2, "foundation", 2021, "chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2CH_que_20211130.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2ch-rms-20220224.pdf",
		2, "higher", 2021, "chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2PF_que_20211202.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2pf-rms-20220224.pdf",
		2, "foundation", 2021, "phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2PH_que_20211202.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1sc0-2ph-rms-20220224.pdf",
		2, "higher", 2021, "phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1BF_que_20201107.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1BF_msc_20210211.pdf",
		1, "foundation", 2020, "bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1BH_que_20201107.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1BH_msc_20210211.pdf",
		1, "higher", 2020, "bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1CF_que_20201111.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1CF_msc_20210211.pdf",
		1, "foundation", 2020, "chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1CH_que_20201111.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1CH_msc_20210211.pdf",
		1, "higher", 2020, "chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1PF_que_20201114.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1PF_msc_20210211.pdf",
		1, "foundation", 2020, "phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1PH_que_20201114.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1PH_msc_20210211.pdf",
		1, "higher", 2020, "phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2BF_que_20201119.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2BF_msc_20210211.pdf",
		2, "foundation", 2020, "bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2BH_que_20201119.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2BH_msc_20210211.pdf",
		2, "higher", 2020, "bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2CF_que_20201121%281%29.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2CF_msc_20210211.pdf",
		2, "foundation", 2020, "chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2CH_que_20201121.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2CH_msc_20210211.pdf",
		2, "higher", 2020, "chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2PF_que_20201124.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2PF_msc_20210211.pdf",
		2, "foundation", 2020, "phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2PH_que_20201124.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2PH_msc_20210211.pdf",
		2, "higher", 2020, "phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1BF_que_20190515.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1BF_rms_20190822.pdf",
		1, "foundation", 2019, "bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1BH_que_20190515.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1BH_rms_20190822.pdf",
		1, "higher", 2019, "bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1CF_que_20190517.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1CF_rms_20190822.pdf",
		1, "foundation", 2019, "chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1CH_que_20190517.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1CH_rms_20190822.pdf",
		1, "higher", 2019, "chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1PF_que_20190523.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1PF_rms_20190822.pdf",
		1, "foundation", 2019, "phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1PH_que_20190523.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1PH_rms_20190822.pdf",
		1, "higher", 2019, "phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2BF_que_20190608.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2BF_rms_20190822.pdf",
		2, "foundation", 2019, "bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2BH_que_20190608.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2BH_rms_20190822.pdf",
		2, "higher", 2019, "bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2CF_que_20190613.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2CF_rms_20190822.pdf",
		2, "foundation", 2019, "chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2CH_que_20190613.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2CH_rms_20190822.pdf",
		2, "higher", 2019, "chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2PF_que_20190615.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2PF_rms_20190822.pdf",
		2, "foundation", 2019, "phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2PH_que_20190615.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2PH_rms_20190822.pdf",
		2, "higher", 2019, "phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1BF_Exam%20paper_20180515.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1BF_Mark-Scheme_20180822.pdf",
		1, "foundation", 2018, "bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1BH_Exam-paper_20180515.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1BH_Mark-Scheme_20180822.pdf",
		1, "higher", 2018, "bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2BF_Exam-paper_20180612.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2BF_Mark-Scheme_20180822.pdf",
		2, "foundation", 2018, "bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2BH_Exam-paper_20180612.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2BH_Mark-Scheme_20180822.pdf",
		2, "higher", 2018, "bio-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1CF_Exam-paper_20180518.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1CF_Mark-Scheme_20180822.pdf",
		1, "foundation", 2018, "chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1CH_Exam-paper_20180518.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1CH_Mark-Scheme_20180822.pdf",
		1, "higher", 2018, "chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2CF_Exam-paper_20180614.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2CF_Mark-Scheme_20180822.pdf",
		2, "foundation", 2018, "chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2CH_Exam-paper_20180614.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2CH_Mark-Scheme_20180822.pdf",
		2, "higher", 2018, "chem-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1PF_Exam-paper_20180524.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1PF_Mark-Scheme_20180822.pdf",
		1, "foundation", 2018, "phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1PH_Exam-paper_20180524.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_1PH_Mark-Scheme_20180822.pdf",
		1, "higher", 2018, "phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2PF_Exam-paper_20180616.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2PF_Mark-Scheme_20180822.pdf",
		2, "foundation", 2018, "phy-c",
	],
	[
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2PH_Exam%20paper_20180616.pdf",
		"https://revisionscience.com/sites/revisionscience.com/files/imce/1SC0_2PH_Mark-Scheme_20180822.pdf",
		2, "higher", 2018, "phy-c",
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
	subject: null | typeof papers["papers"][number]["subject"] = null,
	board: typeof papers["papers"][number]["board"] = "edexcel",
) {
	const mspdf = await fetch(msurl).then((r) => r.blob());
	const paperpdf = await fetch(paperurl).then((r) => r.blob());

	const paperId = ulid();
	console.log("Writing with id", paperId);

	await Bun.write(path.join(__dirname, "../public/papers", `${paperId}-ms.pdf`), mspdf);
	await Bun.write(path.join(__dirname, "../public/papers", `${paperId}-paper.pdf`), paperpdf);

	// $`start ${path.join(__dirname, "../public/papers", `${paperId}-ms.pdf`)}`;
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
		subject : subject ?? (await zodInput("Subject: ", schema.element.shape.subject)),
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
	await Bun.write(path.join(__dirname, "../public/papers.json"), JSON.stringify(papers, null, 2));
}

for (const paper of urls) {
	await addpaper(...paper);
}

await Bun.write(path.join(__dirname, "../public/papers.json"), JSON.stringify(papers, null, 2));
rl.close();
