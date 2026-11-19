import { queryKeys } from "@/lib/queryKeys";
import {
	uploadAccountStatement,
	uploadCardStatement,
} from "@/api/uploadStatement";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUploadAccountStatement = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: uploadAccountStatement,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.loans.all });
		},
	});
};

export const useUploadCardStatement = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: uploadCardStatement,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.cardTransactions.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
		},
	});
};
