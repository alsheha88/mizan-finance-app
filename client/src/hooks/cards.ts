import { queryKeys } from "@/lib/queryKeys";
import {
	createCard,
	deleteCard,
	editCard,
	getCard,
	getCards,
} from "@/api/cards";
import { getApiErrorMessage } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetCards = () => {
	return useQuery({
		queryKey: queryKeys.cards.all,
		queryFn: getCards,
	});
};
export const useGetCard = (id: string) => {
	return useQuery({
		queryKey: queryKeys.cards.detail(id),
		queryFn: () => getCard({ id: id }),
	});
};

export const useCreateCard = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createCard,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.debtPlan.all });

			toast.success("Card created successfully");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useEditCard = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: editCard,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.debtPlan.all });

			toast.success("Changes saved");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	
	});
};
export const useDeleteCard = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteCard,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.cardTransactions.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.debtPlan.all });


			toast.success("Card deleted");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
