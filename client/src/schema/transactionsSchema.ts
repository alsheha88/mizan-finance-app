import z from "zod";
import type {
	CardTransactionType,
	PaletteColor,
	RowType,
	TransactionType,
} from "./enums";

export const updatedTransactionSchema = z.object({
	merchant: z.string().min(1, "This field is required").optional(),
	categoryId: z.uuid().optional(),

});

export type UpdateTransaction = z.infer<typeof updatedTransactionSchema>;

export type TransactionListItem = {
	accountId: string;
	id: string;
	updatedAt: string;
	userId: string;
	merchant: string;
	description: string;
	isEdited: boolean;
	balanceAfter: string;
	type: TransactionType;
	amount: string;
	statementRow: number;
	rowType: RowType;
	transactionDate: string;
	notes: string | null;
	categoryId: string | null;
	transferGroupId: string | null;
	loanId: string | null;
	creditCardId: string | null;
	category: {
		name: string;
		color: PaletteColor;
	} | null;
	account: { name: string };
};

export type Transaction = {
	accountId: string;
	id: string;
	updatedAt: string;
	userId: string;
	merchant: string;
	description: string;
	isEdited: boolean;
	balanceAfter: string;
	type: TransactionType;
	amount: string;
	statementRow: number;
	rowType: RowType;
	transactionDate: string;
	notes: string | null;
	categoryId: string | null;
	transferGroupId: string | null;
	loanId: string | null;
	creditCardId: string | null;
	creditCard: {
		cardNumber: string;
	} | null;
	category: {
		name: string;
		color: PaletteColor;
	} | null;
	loan: {
		invoiceNumber: string;
	} | null;
};

export type TransactionResponse = {
	accountId: string;
	id: string;
	updatedAt: string;
	userId: string;
	merchant: string;
	description: string;
	isEdited: boolean;
	balanceAfter: string;
	type: TransactionType;
	amount: string;
	statementRow: number;
	rowType: RowType;
	transactionDate: string;
	notes: string | null;
	categoryId: string | null;
	transferGroupId: string | null;
	loanId: string | null;
	creditCardId: string | null;
};

export type CardTransactionResponse = {
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
};
