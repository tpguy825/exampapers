import { z } from "zod";
import { boards, difficulties, levels, subjectKeys } from "./schema-types";

export type Schema = z.infer<typeof schema>;
export const schema = z.array(
	z.object({
		uid: z.string().ulid(),
		code: z.string({ message: "Invalid code" }),
		year: z
			.number({ message: "Year must be a number" })
			.int({ message: "Year must be a number" })
			.gt(2000, { message: "Year must be greater than 2000" })
			.lt(2100, { message: "Year must be less than 2100" }),
		difficulty: z.enum(difficulties, { message: "Invalid difficulty" }),
		level: z.enum(levels, { message: "Invalid level" }), // GCSEs only for now
		subject: z.enum(subjectKeys, { message: "Invalid subject" }),
		board: z.enum(boards, { message: "Invalid board" }),
		paper: z
			.number({ message: "Paper number must be a number, it's in the name" })
			.int({ message: "Paper number must be an integer" })
			.gt(0, { message: "Paper number must be greater than 0 (?????)" })
			.lt(10, { message: "Paper number must be less than 10" }),
		paperpdfUrl: z.string({ message: "Invalid URL" }).url({ message: "Invalid URL" }), // Source of the paper
		mspdfUrl: z.string({ message: "Invalid URL" }).url({ message: "Invalid URL" }), // Source of the mark scheme
		paperpdf: z.string({ message: "Invalid URL" }), // Local URL of the paper
		mspdf: z.string({ message: "Invalid URL" }), // Local URL of the mark scheme
	}),
);
