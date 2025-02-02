import { type Schema } from "../../scripts/schema";
import { useState } from "preact/hooks";
import { loadPapers } from "../utils";
import { subjectKeys } from "../../scripts/schema-types";

export default function Search() {
	const [search, setSearch] = useState("");
	const [results, setResults] = useState<Schema>([]);
	const [loading, setLoading] = useState(false);

	const searchPapers = async () => {
		setLoading(true);
		const papers = await loadPapers();
		setResults(
			papers.papers.filter((paper) => {
				const searchTerms = search.toLowerCase().trim().split(" ");
				const paperString = Object.values(paper).join(" ").toLowerCase();
				console.log(searchTerms, paperString);
				return searchTerms.every((term) => paperString.includes(term));
			}),
		);
		setLoading(false);
	};

	return (
		<div class="p-4">
			<div class="flex">
				<input
					type="text"
					value={search}
					onInput={(e) => {
						setSearch((e.target as HTMLInputElement).value);
						if ((e.target as HTMLInputElement).value.trim().length >= 3) searchPapers();
					}}
					class="w-96 cursor-text rounded rounded-r-none border border-zinc-700 bg-zinc-950 px-2 py-1 text-xl focus:bg-zinc-900 focus:outline-none"
				/>
				<button
					class="w-10 rounded rounded-l-none border border-l-0 border-zinc-700 bg-zinc-950 hover:cursor-pointer hover:bg-zinc-900"
					onClick={searchPapers}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="m-auto h-5 w-5">
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.3-4.3" />
					</svg>
				</button>
			</div>
			{loading ? (
				<p>Loading...</p>
			) : search.trim().length < 3 ? (
				<div class="m-4 text-lg">
					Enter information about a paper above to search for it. You can search by:
					<ul class="ml-4 list-disc">
						<li>
							Paper code (for example:)
							<ul class="list-inside list-disc">
								<li>P72627 from the cover of a Edexcel exam</li>
								<li>IB/M/Jun23/8300/1H from any page of an AQA paper (the IB/M/ can be ignored)</li>
								<li>etc.</li>
							</ul>
						</li>
						<li>Year (e.g. 2023 - pretty obvious)</li>
						<li>Month (3 letters, e.g. jan)</li>
						<li>Tier (higher, foundation, na [not tiered])</li>
						<li>
							Level (gcse only atm{" "}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="mr-0.5 inline h-5 w-5">
								<circle cx="12" cy="12" r="10" />
								<path d="M16 16s-1.5-2-4-2-4 2-4 2" />
								<line x1="9" x2="9.01" y1="9" y2="9" />
								<line x1="15" x2="15.01" y1="9" y2="9" />
							</svg>
							)
						</li>
						<li title={"All available options: " + subjectKeys.join(", ")}>
							Subject (e.g. maths, bio-c for biology combined, phy-s for physics seperate)
						</li>
						<li>Board (e.g. aqa, edexcel)</li>
						<li>Paper number (e.g. 1, 2, 3 - also obvious)</li>
					</ul>
					{search.trim().length > 0 ? <p>Enter at least 3 characters to search</p> : null}
				</div>
			) : (
				<ul>
					{results.length > 0 ? (
						results.map((paper) => (
							<li key={paper.uid}>
								<div></div>
							</li>
						))
					) : (
						<>
							<p>No results</p>
							<a
								href="/request"
								class="w-10 rounded rounded-l-none border border-l-0 border-zinc-700 bg-zinc-950 hover:cursor-pointer hover:bg-zinc-900">
								Request paper
							</a>
						</>
					)}
				</ul>
			)}
		</div>
	);
}
