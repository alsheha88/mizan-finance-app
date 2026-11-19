import { queryKeys } from "@/lib/queryKeys";
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
import type { TransactionResponse } from "@/schema/transactionsSchema";
import type { Category } from "@/schema/categoriesSchema";
import type { CardTransaction } from "@/schema/creditCardsSchema";

export const useGetTransactions = (
	params: TransactionsOptions,
	enabled: boolean = true,
) => {
	return useQuery({
		queryKey: queryKeys.transactions.list(params),
		queryFn: () => getTransactions(params),
		placeholderData: keepPreviousData,
		enabled: enabled,
	});
};

export const useGetCardTransactions = (params: CardTransactionsOptions) => {
	return useQuery({
		queryKey: queryKeys.cardTransactions.list(params),
		queryFn: () => getCardTransactions(params),
		placeholderData: keepPreviousData,
	});
};

export const useEditTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: editTransaction,
		onMutate: async ({ params, data }) => {
			await queryClient.cancelQueries({ queryKey: queryKeys.transactions.all });

			const previous = queryClient.getQueriesData({
				queryKey: queryKeys.transactions.all,
			});

			const categories = queryClient.getQueryData<Category[]>(queryKeys.categories.all);
			const nextCategory =
				data.categoryId === undefined
					? undefined
					: (categories?.find((c) => c.id === data.categoryId) ?? null);

			queryClient.setQueriesData(
				{ queryKey: queryKeys.transactions.all },
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
			queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
		},
	});
};
export const useEditCardTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: editCardTransaction,
		onSuccess: () => {
			toast.success("Changes saved");
		},
		onMutate: async ({ params, data }) => {
			await queryClient.cancelQueries({ queryKey: queryKeys.cardTransactions.all });

			const previous = queryClient.getQueriesData({
				queryKey: queryKeys.cardTransactions.all,
			});

			const categories = queryClient.getQueryData<Category[]>(queryKeys.categories.all);
			const nextCategory =
				data.categoryId === undefined
					? undefined
					: (categories?.find((c) => c.id === data.categoryId) ?? null);

			queryClient.setQueriesData(
				{ queryKey: queryKeys.cardTransactions.all },
				(
					old: { transactions: CardTransaction[]; count: number } | undefined,
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
			queryClient.invalidateQueries({ queryKey: queryKeys.cardTransactions.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
		},
	});
};
export const useDeleteAccountTransactions = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteAccountTransaction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
			toast.success("All transaction deleted");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
