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
