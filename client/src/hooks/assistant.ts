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
		// Returning a promise makes TanStack wait for it before running the
		// onSuccess passed to mutate() in the page, which clears the pending
		// bubble. So the real messages are in the cache before the bubble goes.
		onSuccess: (data, variables) => {
			const conversationKey = ["conversations", data.conversationId];

			return Promise.all([
				// The history list: new title or new order (updatedAt).
				queryClient.invalidateQueries({
					queryKey: ["conversations"],
					exact: true,
				}),
				variables.conversationId
					? // Existing chat: it's on screen, refetch it.
						queryClient.invalidateQueries({ queryKey: conversationKey })
					: // New chat: nobody has loaded it yet, so load it now,
						// before the page navigates to it.
						queryClient.prefetchQuery({
							queryKey: conversationKey,
							queryFn: () => getConversation({ id: data.conversationId }),
						}),
			]);
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
