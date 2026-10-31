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
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["accounts"] });
		},
	});
};

export const useUploadCardStatement = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: uploadCardStatement,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			queryClient.invalidateQueries({ queryKey: ["cardsTransactions"] });
			queryClient.invalidateQueries({ queryKey: ["cards"] });
		},
	});
};
