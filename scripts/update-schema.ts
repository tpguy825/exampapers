import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import * as path from "path";
import { schema } from "./schema";

await Bun.write(
	path.join(__dirname, "../public/papers.schema.json"),
	JSON.stringify(zodToJsonSchema(z.object({ $schema: z.string().optional(), papers: schema })), null, "\t"),
);
