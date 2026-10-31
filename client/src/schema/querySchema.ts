import z from "zod";
import { CardTransactionType, TransactionType } from "./enums";

export const queryParamsSchema = z.object({
	type: z.enum(TransactionType).optional(),
	categoryId: z.uuid().optional(),
	search: z.string().optional(),
	accountId: z.uuid().optional(),
	month: z
		.string()
		.regex(/^\d{4}-\d{2}$/)
		.optional(),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100),
});
export const cardQueryParamsSchema = z.object({
	type: z.enum(CardTransactionType).optional(),
	categoryId: z.uuid().optional(),
	search: z.string().optional(),
	creditCardId: z.uuid().optional(),
	month: z
		.string()
		.regex(/^\d{4}-\d{2}$/)
		.optional(),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100),
});

export const dashboardQueryParamsSchema = z.object({
	month: z
		.string()
		.regex(/^\d{4}-\d{2}$/)
		.default(() => {
			const now = new Date();
			return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
		}),
});

export type TransactionsOptions = z.infer<typeof queryParamsSchema>;
export type CardTransactionsOptions = z.infer<typeof cardQueryParamsSchema>;
