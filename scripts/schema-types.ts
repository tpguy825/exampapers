export const boards = ["aqa", "edexcel", "ocr"] as const;
export type Board = (typeof boards)[number];

export const subjectKeys = [
	"maths",
	"english",
	"bio-c",
	"bio-s",
	"chem-c",
	"chem-s",
	"phy-c",
	"phy-s",
	"comp",
	"french",
] as const;
export const subjects = {
	maths: "Maths",
	english: "English",
	"bio-c": "Biology (combined)",
	"bio-s": "Biology (seperate)",
	"chem-c": "Chemistry (combined)",
	"chem-s": "Chemistry (seperate)",
	"phy-c": "Physics (combined)",
	"phy-s": "Physics (seperate)",
	comp: "Computer Science",
	french: "French",
} as const satisfies Record<(typeof subjectKeys)[number], string>;
export type Subjects = typeof subjects;
export type Subject = (typeof subjectKeys)[number];

export const levels = ["gcse"] as const;
export type Level = (typeof levels)[number];
