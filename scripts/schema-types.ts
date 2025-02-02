export const boards = ["aqa", "edexcel", "ocr"] as const;
export type Board = (typeof boards)[number];

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
} as const;
export type Subjects = typeof subjects;
export type Subject = keyof Subjects;
export const subjectKeys = Object.keys(subjects) as Subject[];

export const levels = ["gcse"] as const;
export type Level = (typeof levels)[number];
