import {
	getConversation,
	listConversations,
	sendMessage,
} from "@/api/assistant";
import { getApiErrorMessage } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useListConversations = () => {
	return useQuery({
		queryKey: ["conversations"],
		queryFn: listConversations,
	});
};
export const useGetConversation = (id: string | undefined) => {
	return useQuery({
		queryKey: ["conversations", id],
		queryFn: () => getConversation({ id: id! }),
		enabled: !!id,
	});
};

export const useSendMessage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: sendMessage,
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["conversations", data.conversationId],
			});
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
