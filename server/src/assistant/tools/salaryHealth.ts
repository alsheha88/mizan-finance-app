import type Anthropic from "@anthropic-ai/sdk";
import { toJSONSchema } from "zod";
import { salaryHealthSchema } from "../../schema/toolsSchema";
import { z } from "zod";
import { calculateSalaryHealth } from "../../lib/salaryHealth.js";

export const salaryHealthToolDefinition = {
	name: "getSalaryHealth",
	description:
		"Analyses the user's salary cycles: how much of each salary was spent, paid in loan installments, and saved. Use it for questions about saving, spending against salary, how much of the salary is left, or how much installments take from the salary. A cycle runs from one salary deposit up to the next salary deposit. The newest cycle is unfinished (isComplete: false) because the next salary hasn't arrived yet, so its numbers are partial; don't compare it directly with complete cycles. totalSpending = bank spending + credit card purchases, excluding transfers and card payments. Card purchases only include cards whose statements were imported, so spending may be understated for other cards. net = salary + otherIncome - totalSpending - loanInstallments. loansReceived (new loan financing) and loanPayoffs (early loan settlements) are excluded from otherIncome, totalSpending and net, and reported separately; mention them when they are non-zero. All amounts are in Kuwaiti Dinars (KWD). Fields ending in Percent are percentages of that cycle's salary. averages covers complete cycles only and is null when there are none yet. Dates are YYYY-MM-DD.",
	input_schema: toJSONSchema(salaryHealthSchema, {
		io: "input",
	}) as Anthropic.Tool.InputSchema,
} satisfies Anthropic.Tool;

export const getSalaryHealth = async (input: unknown, userId: string) => {
	const parsed = salaryHealthSchema.safeParse(input);

	if (!parsed.success) {
		return { error: z.prettifyError(parsed.error) };
	}

	return calculateSalaryHealth(userId, parsed.data.count);
};
