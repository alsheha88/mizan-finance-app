import z from "zod";

export const createRecurringPaymentSchema = z.object({
	name: z.string().trim().min(1, "This field is required").max(60),
	expectedAmount: z.number().positive().multipleOf(0.001).max(1_000_000),
	expectedDay: z.int().min(1).max(31),
	amountVaries: z.boolean().optional(),
	categoryId: z.uuid().optional(),
	transactionId: z.uuid(),
	source: z.enum(["bank", "card"]),
});

export type CreateRecurringPaymentData = z.infer<
	typeof createRecurringPaymentSchema
>;

// matchKey and source are left out on purpose: they come from the transaction
// the payment was created from, and matching depends on them.
export const updateRecurringPaymentSchema = z
	.object({
		name: z.string().trim().min(1, "This field is required").max(60),
		expectedAmount: z.number().positive().multipleOf(0.001).max(1_000_000),
		expectedDay: z.int().min(1).max(31),
		amountVaries: z.boolean(),
		isActive: z.boolean(),
		categoryId: z.uuid().nullable(),
	})
	.partial();

export const transactionLinkSchema = z.object({
	transactionId: z.uuid(),
	source: z.enum(["bank", "card"]),
});

export type UpdateRecurringPaymentData = z.infer<
	typeof updateRecurringPaymentSchema
>;
export type TransactionLinkData = z.infer<typeof transactionLinkSchema>;
