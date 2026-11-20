import z, { type RefinementCtx } from "zod";
import { CardType } from "./enums";
import type { CardTransactionType, PaletteColor } from "./enums";

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
	expiryDate: z.date(),
	type: z.enum(CardType),
	creditLimit: z
		.number({ error: "Enter the credit card limit" })
		.positive()
		.multipleOf(0.001)
		.max(1_000_000),
	outstandingBalance: z
		.number({ error: "Enter the current balance" })
		.multipleOf(0.001)
		.min(-1_000_000)
		.max(1_000_000),
	installmentPercentage: z
		.number({ error: "Enter the deduction percentage" })
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

export type CreditCard = {
	id: string;
	name: string;
	cardLast4: string;
	type: CardType;
	creditLimit: string;
	outstandingBalance: string;
	expiryDate: string;
	createdAt: string;
	updatedAt: string;
	userId: string;
	installmentPercentage: string | null;
	outstandingBalanceUpdatedAt: string;
};

export type CardTransaction = {
	id: string;
	merchant: string;
	description: string;
	amount: string;
	transactionDate: string;
	createdAt: string;
	updatedAt: string;
	isEdited: boolean;
	cardTransactionType: CardTransactionType;
	creditCardId: string;
	categoryId: string | null;
	userId: string;
	category: {
		name: string;
		color: PaletteColor;
	} | null;
	card: {
		name: string;
	} | null;
};
