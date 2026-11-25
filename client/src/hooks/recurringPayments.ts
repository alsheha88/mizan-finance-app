import {
	createRecurringPayment,
	deleteRecurringPayment,
	editRecurringPayment,
	getRecurringPayments,
	linkTransaction,
	unlinkTransaction,
} from "@/api/recurringPayments";
import { getApiErrorMessage } from "@/lib/api";
import { plural } from "@/lib/helpers";
import { queryKeys } from "@/lib/queryKeys";
import {
	useMutation,
	useQuery,
	useQueryClient,
	type QueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

// Creating, deleting, linking and unlinking change which transactions are
// linked, so the transaction lists (and their "Recurring" tags) refresh too.
const invalidateWithTransactions = (queryClient: QueryClient) => {
	queryClient.invalidateQueries({ queryKey: queryKeys.recurringPayments.all });
	queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
	queryClient.invalidateQueries({ queryKey: queryKeys.cardTransactions.all });
};

export const useGetRecurringPayments = () => {
	return useQuery({
		queryKey: queryKeys.recurringPayments.all,
		queryFn: getRecurringPayments,
	});
};

export const useCreateRecurringPayment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createRecurringPayment,
		onSuccess: ({ recurringPayment, linkedCount }) => {
			invalidateWithTransactions(queryClient);
			toast.success(
				linkedCount > 0
					? `${recurringPayment.name} added, ${plural(linkedCount, "earlier payment")} linked`
					: `${recurringPayment.name} added`,
			);
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useEditRecurringPayment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: editRecurringPayment,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.recurringPayments.all,
			});
			toast.success("Changes saved");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useDeleteRecurringPayment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteRecurringPayment,
		onSuccess: () => {
			invalidateWithTransactions(queryClient);
			toast.success("Recurring payment deleted");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useLinkTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: linkTransaction,
		onSuccess: () => {
			invalidateWithTransactions(queryClient);
			toast.success("Transaction linked");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useUnlinkTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: unlinkTransaction,
		onSuccess: () => {
			invalidateWithTransactions(queryClient);
			toast.success("Transaction unlinked");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
