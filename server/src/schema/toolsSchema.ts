import z from "zod";
import { TransactionType } from "../../generated/prisma/enums.js";

export const spendingInput = z.object({
	month: z
		.string()
		.regex(/^\d{4}-\d{2}$/)
		.describe("Month to analyse, in YYYY-MM format, e.g. 2026-10"),
});

export const monthTotalsInput = z.object({
	month: z
		.string()
		.regex(/^\d{4}-\d{2}$/)
		.describe("Month to analyse, in YYYY-MM format, e.g. 2026-10"),
	type: z
		.enum(["income", "expense"])
		.describe("income for money received, expense for money spent"),
});
export const listTransactionsInput = z.object({
	month: z
		.string()
		.regex(/^\d{4}-\d{2}$/)
		.optional()
		.describe(
			"Month to analyse, in YYYY-MM format, e.g. 2026-10. leave empty to search all months",
		),
	type: z
		.enum(TransactionType)
		.optional()
		.describe(
			"income for money received, expense for money spent, or transfers",
		),
	category: z.string().optional().describe("category name e.g. restaurants"),
	account: z.string().optional().describe("user bank account name"),
	minAmount: z.coerce
		.number()
		.optional()
		.describe("minimum transaction amount"),
	maxAmount: z.coerce
		.number()
		.optional()
		.describe("maximum transaction amount"),
	search: z
		.string()
		.optional()
		.describe(
			"Merchant name in English, as it appears on bank statements, e.g. Talabat (طلبات), Carrefour (كارفور).",
		),
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe(
			"Page number. Page 1 is the newest 20 transactions, page 2 the next 20, and so on. Leave empty for page 1.",
		),
});

export const debtStatusInput = z.object({
	name: z
		.string()
		.optional()
		.describe(
			"Loan name, e.g. car loan. Matched loosely, so part of the name is enough. Leave empty to get all loans.",
		),
});


export type SpendingInput = z.infer<typeof spendingInput>;
export type MonthTotalsInput = z.infer<typeof monthTotalsInput>;
