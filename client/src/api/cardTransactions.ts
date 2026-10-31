import { api } from "@/lib/api";
import type {
	CardTransaction,
	UpdateCardTransaction,
} from "@/schema/creditCardsSchema";
import type { CardTransactionsOptions } from "@/schema/querySchema";
import type { IdParams } from "@/schema/userSchema";

type EditCardTransaction = {
	params: IdParams;
	data: UpdateCardTransaction;
};

export const getCardTransactions = async ({
	page,
	limit,
	month,
	creditCardId,
	categoryId,
	search,
	type,
}: CardTransactionsOptions) => {
	const res = await api.get<{
		data: { transactions: CardTransaction[]; count: number };
	}>("/api/card-transactions", {
		params: { page, limit, month, creditCardId, categoryId, search, type },
	});

	return res.data.data;
};

export const getCardTransaction = async (params: IdParams) => {
	const res = await api.get<{ data: { transaction: CardTransaction } }>(
		`/api/card-transactions/${params.id}`,
	);

	return res.data.data.transaction;
};

export const editCardTransaction = async ({
	params,
	data,
}: EditCardTransaction) => {
	const res = await api.patch<{ data: { transaction: CardTransaction } }>(
		`/api/card-transactions/${params.id}`,
		data,
	);

	return res.data.data.transaction;
};

