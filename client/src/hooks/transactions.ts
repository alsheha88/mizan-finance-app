import {
	deleteAccountTransaction,
	editTransaction,
	getTransactions,
} from "@/api/transactions";
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	type CardTransactionsOptions,
	type TransactionsOptions,
} from "@/schema/querySchema";
import {
	editCardTransaction,
	getCardTransactions,
} from "@/api/cardTransactions";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/api";
import type {
	TransactionResponse,
} from "@/schema/transactionsSchema";
import type { Category } from "@/schema/categoriesSchema";
import type { CardTransaction } from "@/schema/creditCardsSchema";

export const useGetTransactions = (params: TransactionsOptions) => {
	return useQuery({
		queryKey: ["transactions", params],
		queryFn: () => getTransactions(params),
		placeholderData: keepPreviousData,
	});
};

export const useGetCardTransactions = (params: CardTransactionsOptions) => {
	return useQuery({
		queryKey: ["cardsTransactions", params],
		queryFn: () => getCardTransactions(params),
		placeholderData: keepPreviousData,
	});
};

export const useEditTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: editTransaction,
		onMutate: async ({ params, data }) => {
			await queryClient.cancelQueries({ queryKey: ["transactions"] });

			const previous = queryClient.getQueriesData({
				queryKey: ["transactions"],
			});

			const categories = queryClient.getQueryData<Category[]>(["categories"]);
			const nextCategory =
				data.categoryId === undefined
					? undefined
					: (categories?.find((c) => c.id === data.categoryId) ?? null);

			queryClient.setQueriesData(
				{ queryKey: ["transactions"] },
				(
					old:
						| { transactions: TransactionResponse[]; count: number }
						| undefined,
				) => {
					if (!old) return old;
					return {
						...old,
						transactions: old.transactions.map((t) =>
							t.id === params.id
								? {
										...t,
										...data,
										...(nextCategory !== undefined && {
											category: nextCategory
												? { name: nextCategory.name, color: nextCategory.color }
												: null,
										}),
									}
								: t,
						),
					};
				},
			);

			return { previous };
		},
		onError: (error, _variables, context) => {
			context?.previous?.forEach(([key, value]) => {
				queryClient.setQueryData(key, value);
			});
			toast.error(getApiErrorMessage(error));
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});
};
export const useEditCardTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: editCardTransaction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cardsTransactions"] });
			toast.success("Changes saved");
		},
		onMutate: async ({ params, data }) => {
			await queryClient.cancelQueries({ queryKey: ["cardsTransactions"] });

			const previous = queryClient.getQueriesData({
				queryKey: ["cardsTransactions"],
			});

			const categories = queryClient.getQueryData<Category[]>(["categories"]);
			const nextCategory =
				data.categoryId === undefined
					? undefined
					: (categories?.find((c) => c.id === data.categoryId) ?? null);

			queryClient.setQueriesData(
				{ queryKey: ["cardsTransactions"] },
				(old: { transactions: CardTransaction[]; count: number } | undefined) => {
					if (!old) return old;
					return {
						...old,
						transactions: old.transactions.map((t) =>
							t.id === params.id
								? {
										...t,
										...data,
										...(nextCategory !== undefined && {
											category: nextCategory
												? { name: nextCategory.name, color: nextCategory.color }
												: null,
										}),
									}
								: t,
						),
					};
				},
			);

			return { previous };
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
export const useDeleteAccountTransactions = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteAccountTransaction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			queryClient.invalidateQueries({ queryKey: ["accounts"] });
			toast.success("All transaction deleted");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
