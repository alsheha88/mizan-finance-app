import type Anthropic from "@anthropic-ai/sdk";
import z from "zod";
import { dbSpendingByCategory } from "../../db/functions/dashboard.js";
import { spendingInput } from "../../schema/toolsSchema.js";
import { toolInputError } from "./inputError.js";

export const spendingByCategoryToolDefinition = {
	name: "getSpendingByCategory",
	description:
		"expenses from users bank account and credit card purchases excluding income and transfer transactions. To be used whenever the user asks questions about spending, categories or where his money went in a specific month. Returns the user’s total spending per category for one month, in KD.",
	input_schema: z.toJSONSchema(spendingInput) as Anthropic.Tool.InputSchema,
} satisfies Anthropic.Tool;

export async function getSpendingByCategory(input: unknown, userId: string) {
	const validateRequest = spendingInput.safeParse(input);
	if (!validateRequest.success) return toolInputError(validateRequest.error);
	const data = await dbSpendingByCategory(userId, validateRequest.data.month);
	const spending = data
		.map((i) => {
			return {
				name: i.name,
				total: Number(i.total.toFixed(3)),
			};
		})
		.sort((a, b) => b.total - a.total);

	return spending;
}
