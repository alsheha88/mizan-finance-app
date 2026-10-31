import { api } from "@/lib/api";
import type { TransactionsOptions } from "@/schema/querySchema";
import type {
	Transaction,
	TransactionListItem,
	UpdateTransaction,
} from "@/schema/transactionsSchema";
import type { IdParams } from "@/schema/userSchema";

type EditTransaction = {
	params: IdParams;
	data: UpdateTransaction;
};

export const getTransactions = async ({
	page,
	month,
	accountId,
	categoryId,
	search,
	type,
    limit
}: TransactionsOptions) => {
	const res = await api.get<{
		data: { transactions: TransactionListItem[]; count: number };
	}>("/api/transactions", {
		params: { page,limit, type, categoryId, search, accountId, month },
	});

	return res.data.data;
};
export const getTransaction = async (params: IdParams) => {
	const res = await api.get<{
		data: { transaction: Transaction };
	}>(`/api/transactions/${params.id}`);

	return res.data.data.transaction;
};
export const editTransaction = async ({ params, data }: EditTransaction) => {
	const res = await api.patch<{
		data: { transaction: TransactionListItem };
	}>(`/api/transactions/${params.id}`, data);

	return res.data.data.transaction;
};
export const deleteAccountTransaction = async (params:IdParams) => {
	const res = await api.delete<{
		data: { message: string };
	}>(`/api/accounts/${params.id}/transactions`);

	return res.data.data.message;
};
