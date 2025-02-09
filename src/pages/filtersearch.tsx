import { type Schema } from "../../scripts/schema";
import { useEffect, useState } from "preact/hooks";
import { subjectKeys, boards, subjects, difficulties } from "../../scripts/schema-types";

type Paper = Schema[number];
const hosturl = "https://raw.githubusercontent.com/tpguy825/exampapers/refs/heads/main/public";

function is<T>(a: string | null, b: readonly T[]) {
	// typecript moment              \/ stupid
	console.log(a, b, b.includes(a as T));
	return (a !== null && b.includes(a as T)) ? (a as T) : null;
}

export default function FilterSearch() {
	const url = new URL(window.location.href);
	const [board, setBoard] = useState(is<Paper["board"]>(url.searchParams.get("b"), boards));
	const [subject, setSubject] = useState(is<Paper["subject"]>(url.searchParams.get("s"), subjectKeys));
	// const [level, setLevel] = useState<Paper["level"] | null>(null);
	const [difficulty, setDifficulty] = useState(is<Paper["difficulty"]>(url.searchParams.get("d"), difficulties));
	const [year, setYear] = useState<Paper["year"] | null>(null);
	const [papernum, setPaperNum] = useState<Paper["paper"] | null>(null);
	const [code, setCode] = useState<string | null>(url.searchParams.get("c"));

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

				if (url.searchParams.has("y")) {
					const y = Number(url.searchParams.get("y"));
					if (s.papers.map((p) => p.year).includes(y)) setYear(y);
				}

				if (url.searchParams.has("p")) {
					const p = Number(url.searchParams.get("p"));
					if (s.papers.map((p) => p.paper).includes(p)) setPaperNum(p);
				}
			});
	}, []);

	const results = papers.filter((paper) => {
		// console.log({ board, subject, difficulty, year, papernum, code }, paper);
		if (board !== null && paper.board !== board) return false;
		if (subject !== null && paper.subject !== subject) return false;
		// if (level !== null && paper.level !== level) return false;
		if (difficulty !== null && paper.difficulty !== difficulty) return false;
		if (year !== null && paper.year !== year) return false;
		if (papernum !== null && paper.paper !== papernum) return false;
		if (code !== null && code !== "" && !paper.code.toLowerCase().includes(code.toLowerCase())) return false;
		return true;
	});

	const pushHistory = (obj: Record<string, string | number>) => {
		const url = new URL(window.location.href);
		for (const k of url.searchParams.keys()) {
			url.searchParams.delete(k);
		}
		for (const [k, v] of Object.entries({
			b: board,
			s: subject,
			d: difficulty,
			y: year,
			p: papernum,
			c: code,
		}).filter(([, v]) => v !== null)) {
			url.searchParams.set(k, String(v));
		}
		for (const [k, v] of Object.entries(obj).filter(([, v]) => v !== null)) {
			url.searchParams.set(k, String(v)); // overwrite with new values
		}
		history.pushState({}, "", url.toString());
	};

	return (
		<div class="p-4">
			<div>
				<select
					name="board"
					value={board ?? ""}
					class="mr-2 cursor-pointer rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xl focus:bg-zinc-900 focus:outline-none"
					onChange={(e) => {
						setBoard(e.currentTarget.value !== "" ? (e.currentTarget.value as Paper["board"]) : null);
						pushHistory({ b: e.currentTarget.value });
					}}>
					<option value="" selected>
						Select exam board
					</option>
					{boards.map((b) => (
						<option value={b}>{b}</option>
					))}
				</select>
				<select
					name="subject"
					value={subject ?? ""}
					hidden={board === null}
					class="mr-2 cursor-pointer rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xl focus:bg-zinc-900 focus:outline-none"
					onChange={(e) => {
						pushHistory({ s: e.currentTarget.value });
						setSubject(e.currentTarget.value !== "" ? (e.currentTarget.value as Paper["subject"]) : null);
					}}>
					<option value="" selected>
						Select subject
					</option>
					{subjectKeys.map((s, i) => (
						<option value={s}>{subjects[i]}</option>
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
					value={papernum ?? ""}
					class="mr-2 cursor-pointer rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xl focus:bg-zinc-900 focus:outline-none"
					onChange={(e) => {
						pushHistory({ p: e.currentTarget.value });
						setPaperNum(
							e.currentTarget.value !== "" ? (Number(e.currentTarget.value) as Paper["paper"]) : null,
						);
					}}>
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
					value={difficulty ?? ""}
					class="mr-2 cursor-pointer rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xl focus:bg-zinc-900 focus:outline-none"
					onChange={(e) => {
						pushHistory({ d: e.currentTarget.value });
						setDifficulty(
							e.currentTarget.value !== "" ? (e.currentTarget.value as Paper["difficulty"]) : null,
						);
					}}>
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
					value={year ?? ""}
					class="mr-2 cursor-pointer rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xl focus:bg-zinc-900 focus:outline-none"
					onChange={(e) => {
						pushHistory({ y: e.currentTarget.value });
						setYear(e.currentTarget.value !== "" ? (Number(e.currentTarget.value) as Paper["year"]) : null);
					}}>
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
					onInput={(e) => {
						pushHistory({ c: (e.target as HTMLInputElement).value });
						setCode((e.target as HTMLInputElement).value);
					}}
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
										href={hosturl + paper.paperpdf}
										target="_blank"
										rel="noopener noreferrer"
										class="mr-2 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 hover:cursor-pointer hover:bg-zinc-900">
										Download Paper
									</a>
									<a
										href={hosturl + paper.mspdf}
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
