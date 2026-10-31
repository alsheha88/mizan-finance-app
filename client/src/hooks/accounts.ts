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
		queryKey: ["accounts"],
		queryFn: getAccounts,
	});
};
export const useGetAccount = (id: string) => {
	return useQuery({
		queryKey: ["accounts", id],
		queryFn: () => getAccount({ id: id }),
	});
};

export const useCreateAccount = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createAccount,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["accounts"] });
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
			queryClient.invalidateQueries({ queryKey: ["accounts"] });
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
			queryClient.invalidateQueries({ queryKey: ["accounts"] });
			toast.success("Changes saved");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
