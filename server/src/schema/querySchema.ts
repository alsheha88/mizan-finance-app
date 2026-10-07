import z from "zod";
import { TransactionType } from "../../generated/prisma/enums";

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
});

export type TransactionsOptions = z.infer<typeof queryParamsSchema>