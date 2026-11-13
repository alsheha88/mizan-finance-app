import { api } from "@/lib/api";
import { MessageRole } from "../schema/enums";
import type { IdParams } from "@/schema/userSchema";

type Messages = {
	role: MessageRole;
	text: string;
}[];

type ConversationsListResponse = {
	id: string;
	title: string | null;
	updatedAt: string;
}[];

type SendMessageRequest = {
	message: string;
	conversationId?: string | undefined;
};
export const listConversations = async () => {
	const res = await api.get<{
		data: { conversations: ConversationsListResponse };
	}>("/api/assistant/conversations");

	return res.data.data.conversations;
};
export const getConversation = async (params: IdParams) => {
	const res = await api.get<{
		data: { id: string; title: string | null; messages: Messages };
	}>(`/api/assistant/conversations/${params.id}`);

	return res.data.data;
};

export const sendMessage = async (data: SendMessageRequest) => {
	const res = await api.post<{
		data: { answer: string; conversationId: string };
	}>("/api/assistant/chat", data);

	return res.data.data;
};
