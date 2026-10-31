import { createLoan, deleteLoan, editLoan, getLoan, getLoans } from "@/api/loans";
import { getApiErrorMessage } from "@/lib/api";
import type { IdParams } from "@/schema/userSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetLoans = () => {
	return useQuery({
		queryKey: ["loans"],
		queryFn: getLoans,
	});
};
export const useGetLoan = (params: IdParams) => {
	return useQuery({
		queryKey: ["loans", params],
		queryFn: () => getLoan(params),
	});
};

export const useCreateLoan = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createLoan,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["loans"] });
			toast.success("Loan created successfully");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
export const useEditLoan = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: editLoan,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["loans"] });
			toast.success("Changes saved");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
export const useDeleteLoan = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteLoan,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["loans"] });
			toast.success("Loan deleted");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
