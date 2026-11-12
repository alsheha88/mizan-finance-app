import type { RequestHandler } from "express";
import { chatSchema } from "../schema/conversationsSchema";
import { NotFoundError, ValidationError } from "../../errors/errors";
import {
	dbCreateConversation,
	dbGetConversation,
	dbGetConversationMessages,
	dbListConversations,
	dbSaveMessages,
} from "../db/functions/conversations";
import type Anthropic from "@anthropic-ai/sdk";
import { runAgent } from "../assistant/agent";
import { idParamsSchema } from "../schema/userSchema";

type MessageToSave = {
	role: "user" | "assistant";
	content: Anthropic.MessageParam["content"];
	inputTokens?: number;
	outputTokens?: number;
};
export const chat: RequestHandler = async (req, res) => {
	const userId = req.user.id;

	// 1. Validate the request body
	const validateRequest = chatSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Failed to validate input data",
			validateRequest.error.issues,
		);
	const { message, conversationId: requestedId } = validateRequest.data;

	// 2. Get or create the conversation, and its history
	let conversationId: string;
	let messages: Anthropic.MessageParam[] = [];

	if (!requestedId) {
		const newConversation = await dbCreateConversation(userId, message);
		conversationId = newConversation.id;
	} else {
		const conversation = await dbGetConversationMessages(userId, requestedId);
		if (!conversation) throw new NotFoundError("Conversation not found");
		conversationId = conversation.id;
		messages = conversation.messages.map((row) => ({
			role: row.role,
			content: row.content as Anthropic.MessageParam["content"],
		}));
	}

	// 3. Add the new question and run the agent
	const startIndex = messages.length;
	messages.push({ role: "user", content: message });
	const result = await runAgent(messages, userId);

	// 4. Save only the new messages, with the token totals on the last one
	const newMessages = messages.slice(startIndex);
	const lastIndex = newMessages.length - 1;
	const toSave: MessageToSave[] = newMessages.map((msg, i) => {
		if (msg.role === "system") {
			throw new Error("Unexpected system message in conversation");
		}
		return {
			role: msg.role,
			content: msg.content,
			...(i === lastIndex && {
				inputTokens: result.inputTokens,
				outputTokens: result.outputTokens,
			}),
		};
	});
	await dbSaveMessages(conversationId, toSave, startIndex);

	// 5. Respond
	res.status(200).json({ data: { answer: result.text, conversationId } });
};

export const listConversations: RequestHandler = async (req, res) => {
	const userId = req.user.id;

	const conversations = await dbListConversations(userId);

	res.status(200).json({ data: { conversations } });
};

export const getConversation: RequestHandler = async (req, res) => {
	const userId = req.user.id;

	// 1. Validate the id in the URL
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate conversation id",
			parsedId.error.issues,
		);

	// 2. Load the conversation (only if it belongs to this user)
	const data = await dbGetConversationMessages(userId, parsedId.data.id);
	if (!data) throw new NotFoundError("Conversation not found");

	// 3. Turn each saved message into { role, text }
	const messages = data.messages
		.map((msg) => {
			const content = msg.content as Anthropic.MessageParam["content"];

			// A plain string: the user's own question
			if (typeof content === "string") {
				return { role: msg.role, text: content };
			}

			// An array of blocks: keep only the text blocks, and join them
			const text = content
				.map((block) => (block.type === "text" ? block.text : ""))
				.join("");

			return { role: msg.role, text };
		})
		// 4. Drop messages with no text (tool results, tool-only requests)
		.filter((msg) => msg.text.trim() !== "");

	res.status(200).json({
		data: { id: data.id, title: data.title, messages },
	});
};
