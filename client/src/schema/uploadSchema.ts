import z from "zod";

export const accountIdSchema = z.object({
	accountId: z.uuid(),
});
export const creditCardIdSchema = z.object({
	creditCardId: z.uuid(),
});

export type AccountId = z.infer<typeof accountIdSchema>;
export type CreditCardId = z.infer<typeof creditCardIdSchema>;
