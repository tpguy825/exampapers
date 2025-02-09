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
export const subjects = [
	"Maths",
	"English",
	"Biology (combined)",
	"Biology (seperate)",
	"Chemistry (combined)",
	"Chemistry (seperate)",
	"Physics (combined)",
	"Physics (seperate)",
	"Computer Science",
	"French",
] as const satisfies string[];
export type Subjects = typeof subjects;
export type Subject = (typeof subjectKeys)[number];

export const levels = ["gcse"] as const;
export type Level = (typeof levels)[number];

export const difficulties = ["higher", "foundation", "na"] as const;
export type Difficulty = (typeof difficulties)[number];
