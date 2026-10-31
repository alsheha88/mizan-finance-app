import z from "zod";
import { CardType } from "./enums";
import type { CardTransactionType, PaletteColor } from "./enums";

export const createCardSchema = z.object({
	name: z.string().min(1, "This field is required"),
	cardNumber: z
		.string()
		.length(4)
		.regex(/^\d{4}$/),
	expiryDate: z.date(),
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

export type CreditCard = {
	id: string;
	name: string;
	cardNumber: string;
	type: CardType;
	limit: string;
	outstandingBalance: string;
	expiryDate: string;
	createdAt: string;
	updatedAt: string;
	userId: string;
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
