import z from "zod";

export const updatedTransactionSchema = z.object({
	merchant: z.string().min(1, "This field is required").optional(),
	notes: z.string().optional(),
	categoryId: z.uuid().optional(),
	loanId: z.uuid().optional(),
	creditCardId: z.uuid().optional(),
});

export type UpdateTransaction = z.infer<typeof updatedTransactionSchema>;
