import z from "zod";
import { CardType } from "../../generated/prisma/enums";

export const createCardSchema = z.object({
	name: z.string().min(1, "This field is required"),
	cardNumber: z
		.string()
		.length(4)
		.regex(/^\d{4}$/),
	expiryDate: z.coerce.date(),
	type: z.enum(CardType),
	limit: z.number().positive().multipleOf(0.001).max(1_000_000),
	outstandingBalance: z
		.number()
		.multipleOf(0.001)
		.min(-1_000_000)
		.max(1_000_000),
});

export const updateCardSchema = createCardSchema
	.omit({ cardNumber: true })
	.partial();
export const updateCardTransactionSchema = z.object({
	merchant: z.string().min(1, "This field is required").optional(),
	categoryId: z.uuid().optional(),
});

export type UpdateCardTransaction = z.infer<typeof updateCardTransactionSchema>;
export type CreateCardData = z.infer<typeof createCardSchema>;
export type UpdateCardData = z.infer<typeof updateCardSchema>;
