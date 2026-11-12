import type Anthropic from "@anthropic-ai/sdk";
import { prisma } from "../../lib/prisma";
import type { MessageRole } from "../../../generated/prisma/enums";
import type { Prisma } from "../../../generated/prisma/client";

type MessageToSave = {
	role: MessageRole;
	content: Anthropic.MessageParam["content"];
	inputTokens?: number;
	outputTokens?: number;
};

export const dbCreateConversation = async (userId: string, title: string) => {
	const slicedTitle = title.slice(0, 60);

	const conversation = await prisma.conversation.create({
		data: {
			title: slicedTitle,
			userId,
		},
	});

	return conversation;
};
export const dbGetConversationMessages = async (
	userId: string,
	conversationId: string,
) => {
	return await prisma.conversation.findFirst({
		where: { id: conversationId, userId },
		include: {
			messages: {
				orderBy: { position: "asc" },
			},
		},
	});
};

export const dbSaveMessages = async (
	conversationId: string,
	messages: MessageToSave[],
	startPosition: number,
) => {
	return prisma.$transaction(async (tx) => {
		await tx.message.createMany({
			data: messages.map((msg, i) => ({
				conversationId,
				role: msg.role,
				content: msg.content as Prisma.InputJsonValue,
				inputTokens: msg.inputTokens ?? null,
				outputTokens: msg.outputTokens ?? null,
				position: startPosition + i,
			})),
		});

		await tx.conversation.update({
			where: { id: conversationId },
			data: { updatedAt: new Date() },
		});
	});
};

export const dbListConversations = async (userId: string) => {
	return await prisma.conversation.findMany({
		where: { userId },
		select: { id: true, title: true, updatedAt: true },
		orderBy: { updatedAt: "desc" },
		take: 50,
	});
};

export const dbGetConversation = async (userId: string, id: string) => {
	return await prisma.conversation.findFirst({ where: { userId, id } });
};
