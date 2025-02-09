import { type Schema } from "../../scripts/schema";
import { useEffect, useState } from "preact/hooks";
import { subjectKeys, boards, subjects } from "../../scripts/schema-types";

type Paper = Schema[number];

export default function FilterSearch() {
	const [board, setBoard] = useState<Paper["board"] | null>(null);
	const [subject, setSubject] = useState<Paper["subject"] | null>(null);
	// const [level, setLevel] = useState<Paper["level"] | null>(null);
	const [difficulty, setDifficulty] = useState<Paper["difficulty"] | null>(null);
	const [year, setYear] = useState<Paper["year"] | null>(null);
	const [papernum, setPaperNum] = useState<Paper["paper"] | null>(null);
	const [code, setCode] = useState<string | null>(null);

	const [loading, setLoading] = useState(true);
	const [papers, setPapers] = useState<Schema>([]);

	useEffect(() => {
		setLoading(true);
		fetch("/papers.json")
			.then(
				(r) =>
					r.json() as Promise<{
						papers: Schema;
					}>,
			)
			.then((s) => {
				setPapers(s.papers);
				setLoading(false);
			});
	}, []);

	const results = papers.filter((paper) => {
		console.log({ board, subject, difficulty, year, papernum, code }, paper);
		if (board !== null && paper.board !== board) return false;
		if (subject !== null && paper.subject !== subject) return false;
		// if (level !== null && paper.level !== level) return false;
		if (difficulty !== null && paper.difficulty !== difficulty) return false;
		if (year !== null && paper.year !== year) return false;
		if (papernum !== null && paper.paper !== papernum) return false;
		if (code !== null && code !== "" && !paper.code.toLowerCase().includes(code.toLowerCase())) return false;
		return true;
	});

	console.log(results, papers);

	return (
		<div class="p-4">
			<div>
				<select
					name="board"
					class="mr-2 cursor-pointer rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xl focus:bg-zinc-900 focus:outline-none"
					onChange={(e) =>
						setBoard(e.currentTarget.value !== "" ? (e.currentTarget.value as Paper["board"]) : null)
					}>
					<option value="" selected>
						Select exam board
					</option>
					{boards.map((b) => (
						<option value={b}>{b}</option>
					))}
				</select>
				<select
					name="subject"
					hidden={board === null}
					class="mr-2 cursor-pointer rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xl focus:bg-zinc-900 focus:outline-none"
					onChange={(e) =>
						setSubject(e.currentTarget.value !== "" ? (e.currentTarget.value as Paper["subject"]) : null)
					}>
					<option value="" selected>
						Select subject
					</option>
					{subjectKeys.map((s) => (
						<option value={s}>{subjects[s]}</option>
					))}
				</select>
				{/* <select name="level" onChange={(e) => setLevel(e.currentTarget.value as Paper["level"])}>
					<option value="" selected disabled>
						Select level
					</option>
					{levels.map((l) => (
						<option value={l}>{l}</option>
					))}
				</select> */}
				<select
					name="paper"
					hidden={subject === null}
					class="mr-2 cursor-pointer rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xl focus:bg-zinc-900 focus:outline-none"
					onChange={(e) =>
						setPaperNum(
							e.currentTarget.value !== "" ? (Number(e.currentTarget.value) as Paper["paper"]) : null,
						)
					}>
					<option value="" selected>
						Select paper
					</option>
					{papers
						.map((p) => p.paper)
						.sort((a, b) => b - a)
						.filter((v, i, a) => a.indexOf(v) === i)
						.map((p) => (
							<option value={p}>Paper {p}</option>
						))}
				</select>
				<select
					name="difficulty"
					hidden={subject === null}
					class="mr-2 cursor-pointer rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xl focus:bg-zinc-900 focus:outline-none"
					onChange={(e) =>
						setDifficulty(
							e.currentTarget.value !== "" ? (e.currentTarget.value as Paper["difficulty"]) : null,
						)
					}>
					<option value="" selected>
						Select tier
					</option>
					<option value="higher">Higher</option>
					<option value="foundation">Foundation</option>
					<option value="na">N/A</option>
				</select>

				<select
					name="year"
					hidden={subject === null}
					class="mr-2 cursor-pointer rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xl focus:bg-zinc-900 focus:outline-none"
					onChange={(e) =>
						setYear(e.currentTarget.value !== "" ? (Number(e.currentTarget.value) as Paper["year"]) : null)
					}>
					<option value="" selected>
						Select year
					</option>
					{papers
						.map((p) => p.year)
						// sort
						.sort((a, b) => b - a)
						.filter((v, i, a) => a.indexOf(v) === i)
						.map((y) => (
							<option value={y}>{y}</option>
						))}
				</select>

				<input
					type="text"
					hidden={subject === null}
					value={code ?? ""}
					placeholder="Enter paper code"
					onInput={(e) => setCode((e.target as HTMLInputElement).value)}
					class="w-96 cursor-text rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xl focus:bg-zinc-900 focus:outline-none"
				/>
			</div>
			{loading ? (
				<p>Loading...</p>
			) : board === null ? (
				<div>
					<p class="text-5xl">Select a board</p>
					<p class="mt-2">Currently hosting {papers.length} papers</p>
				</div>
			) : subject === null ? (
				<p class="text-5xl">Select a subject</p>
			) : results.length > 0 ? (
				<div>
					<span>
						{results.length} {results.length > 1 ? "results" : "result"}
					</span>
					<ul class="mt-4 -ml-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
						{results.map((paper) => (
							<li
								key={paper.uid}
								class="m-2 grid w-auto grid-cols-1 rounded-lg border border-zinc-800 p-2">
								<span class="inline-block">
									{paper.board} - {paper.code} - {paper.year}
								</span>
								<span class="mb-2 inline-block">
									{paper.difficulty} - {paper.level} - {paper.subject} - Paper {paper.paper}
								</span>
								<div class="mb-1">
									<a
										href={paper.paperpdf}
										target="_blank"
										rel="noopener noreferrer"
										class="mr-2 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 hover:cursor-pointer hover:bg-zinc-900">
										Download Paper
									</a>
									<a
										href={paper.mspdf}
										target="_blank"
										rel="noopener noreferrer"
										class="rounded border border-zinc-700 bg-zinc-950 px-2 py-1 hover:cursor-pointer hover:bg-zinc-900">
										Download Mark Scheme
									</a>
								</div>
							</li>
						))}
					</ul>
				</div>
			) : (
				<div class="mt-4 text-xl">
					<span class="inline-block">No results</span>
					<br />
					<a
						href="/request"
						class="mt-1 inline-block rounded border border-zinc-700 bg-zinc-950 px-2 py-1 hover:cursor-pointer hover:bg-zinc-900">
						Request paper
					</a>
				</div>
			)}
		</div>
	);
}
