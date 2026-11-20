import z, { type RefinementCtx } from "zod";
import { CardType } from "../../generated/prisma/enums";

export const requireInstallmentPercentage = (
	data: {
		type?: CardType | undefined;
		installmentPercentage?: number | null | undefined;
	},
	ctx: RefinementCtx,
) => {
	if (data.type === "installment" && data.installmentPercentage == null) {
		ctx.addIssue({
			code: "custom",
			message: "Instalment cards need a deduction percentage",
			path: ["installmentPercentage"],
		});
	}
};

export const cardBaseSchema = z.object({
	name: z.string().min(1, "This field is required"),
	cardLast4: z
		.string()
		.length(4)
		.regex(/^\d{4}$/),
	expiryDate: z.coerce.date(),
	type: z.enum(CardType),
	creditLimit: z.number().positive().multipleOf(0.001).max(1_000_000),
	outstandingBalance: z
		.number()
		.multipleOf(0.001)
		.min(-1_000_000)
		.max(1_000_000),
	installmentPercentage: z
		.number()
		.positive()
		.max(100)
		.multipleOf(0.01)
		.optional()
		.nullable(),
});

export const createCardSchema = cardBaseSchema.superRefine(
	requireInstallmentPercentage,
);

export const updateCardSchema = cardBaseSchema
	.omit({ cardLast4: true })
	.partial()
	.superRefine(requireInstallmentPercentage);
export const updateCardTransactionSchema = z.object({
	merchant: z.string().min(1, "This field is required").optional(),
	categoryId: z.uuid().optional(),
});

export type UpdateCardTransaction = z.infer<typeof updateCardTransactionSchema>;
export type CreateCardData = z.infer<typeof createCardSchema>;
export type UpdateCardData = z.infer<typeof updateCardSchema>;
