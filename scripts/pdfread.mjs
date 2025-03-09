import path from "path";
import { PdfReader } from "pdfreader";

/**
 * @param {string} path
 * @returns {Promise<string>}
 */
export async function getCodeFromPaper(path) {
	const codes = await new Promise((resolve, reject) => {
		let results = [];
		new PdfReader().parseFileItems(path, (err, item) => {
			if (err) reject(err);
			else if (!item)
				resolve(results); //console.warn("end of file");
			else if (!item.text) return;
			else if (!item.text.trim().startsWith("P"))
				return; // console.log("not start p", item.text);
			// fails on revised papers that are 8 due to ending in "RA" instead of "A"
			else if (item.text.trim().length !== 7)
				return; // console.log("not 7 chars", item.text);
			else if (
				!item.text
					.trim()
					.slice(1, 6)
					.match(/^\d{5}$/)
			)
				return; // console.log("not 5 digits", item.text);
			else results.push(item.text);
		});
	});

	return codes[0];
}

let __dirname = path.dirname(new URL(import.meta.url).pathname);
// Windows fix (i made this on linux and only just tried it on windows)
if (process.platform === "win32") __dirname = __dirname.slice(1);
console.log(await getCodeFromPaper(path.join(__dirname, process.argv[2])));
