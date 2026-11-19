import { queryKeys } from "@/lib/queryKeys";
import {
	getAccounts,
	getAccount,
	createAccount,
	editAccount,
	updateAccountActiveStatus,
} from "../api/accounts";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/api";

export const useGetAccounts = () => {
	return useQuery({
		queryKey: queryKeys.accounts.all,
		queryFn: getAccounts,
	});
};
export const useGetAccount = (id: string) => {
	return useQuery({
		queryKey: queryKeys.accounts.detail(id),
		queryFn: () => getAccount({ id: id }),
	});
};

export const useCreateAccount = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createAccount,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
			toast.success("Account created");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
export const useEditAccount = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: editAccount,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
			toast.success("Changes saved");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
export const useUpdateAccountActiveStatus = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateAccountActiveStatus,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
			toast.success("Changes saved");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
