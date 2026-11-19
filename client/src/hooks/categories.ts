import { queryKeys } from "@/lib/queryKeys";
import {
	createCategory,
	deleteCategory,
	editCategory,
	getCategories,
} from "@/api/categories";
import { getApiErrorMessage } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetCategories = () => {
	return useQuery({
		queryKey: queryKeys.categories.all,
		queryFn: getCategories,
	});
};
export const useCreateCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
			toast.success("Changes saved");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
export const useEditCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: editCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.cardTransactions.all });
			toast.success("Changes saved");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
export const useDeleteCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.cardTransactions.all });
			toast.success("Category deleted");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
