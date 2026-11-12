import Anthropic from "@anthropic-ai/sdk";
import { toJSONSchema } from "zod";
import { dbGetIncomeOrExpenseStats } from "../../db/functions/dashboard.js";
import { monthTotalsInput } from "../../schema/toolsSchema.js";

export const monthTotalsToolDefinition = {
	name: "getMonthTotals",
	description:
		"provides the user total income or expenses (bank account expenses only; card purchases are counted when the card bill is paid). to be used whenever the user asks about his income or expenses total during a specific month. it returns the total expeses or income for one month in KD",
	input_schema: toJSONSchema(monthTotalsInput) as Anthropic.Tool.InputSchema,
} satisfies Anthropic.Tool;

export async function getMonthTotals(input: unknown, userId: string) {
	const validateRequest = monthTotalsInput.safeParse(input);
	if (!validateRequest.success)
		return {
			error:
				"month must be in YYYY-MM format, and type should be either income or expenses",
			details: validateRequest.error.message,
		};
	const data = await dbGetIncomeOrExpenseStats(
		userId,
		validateRequest.data.month,
		validateRequest.data.type,
	);
	const total = Number(data._sum.amount?.toFixed(3) ?? 0) ;

	return {
		month: validateRequest.data.month,
		type: validateRequest.data.type,
		total,
	};
}
