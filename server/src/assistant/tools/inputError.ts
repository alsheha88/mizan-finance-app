import { z } from "zod";

// What a tool returns when the model's input fails its schema. The details are
// readable ("✖ Month must be YYYY-MM → at month"), so the model can fix its
// input and call the tool again, instead of getting a raw JSON dump of issues.
export function toolInputError(error: z.ZodError) {
	return {
		error: "Invalid input for this tool. Fix the fields below and call it again.",
		details: z.prettifyError(error),
	};
}
