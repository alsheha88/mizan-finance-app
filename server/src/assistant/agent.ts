import { Anthropic } from "@anthropic-ai/sdk";
import { getSystemPrompt } from "./prompts";
import { runTool, toolDefinitions } from "./tools/registry.js";
const client = new Anthropic();

export async function runAgent(
	messages: Anthropic.MessageParam[],
	userId: string,
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
	let counter = 0;
	const MAX_STEPS = 8;
	let text = "";
	let totalInputTokens = 0;
	let totalOutputTokens = 0;
	const TOO_LONG_MESSAGE =
		"That answer was too long. Please ask for less at once, e.g. one month or the top 10.";
	while (counter < MAX_STEPS) {
		const toolResults: Anthropic.ToolResultBlockParam[] = [];
		const response = await client.messages.create({
			max_tokens: 2000,
			messages,
			model: "claude-haiku-5-5",
			system: getSystemPrompt(),
			thinking: { type: "disabled" },
			tools: toolDefinitions,
		});
		totalOutputTokens += response.usage.output_tokens;
		totalInputTokens += response.usage.input_tokens;
		if (response.stop_reason === "max_tokens") {
			messages.push({
				role: "assistant",
				content: TOO_LONG_MESSAGE,
			});
			return {
				text: TOO_LONG_MESSAGE,
				inputTokens: totalInputTokens,
				outputTokens: totalOutputTokens,
			};
		}
		messages.push({ role: "assistant", content: response.content });
		// Debug output only while developing: production logs shouldn't fill up
		// with every step, and never with what users searched for.
		if (process.env.NODE_ENV !== "production") {
			console.log(
				`[agent] step ${counter + 1}: ${response.stop_reason}, tokens in ${response.usage.input_tokens} / out ${response.usage.output_tokens}`,
			);
		}
		if (response.stop_reason !== "tool_use") {
			for (const block of response.content) {
				if (block.type === "text") {
					text += block.text;
				}
			}
			return {
				text,
				inputTokens: totalInputTokens,
				outputTokens: totalOutputTokens,
			};
		}
		for (const block of response.content) {
			if (block.type === "tool_use") {
				if (process.env.NODE_ENV !== "production") {
					console.log(`[agent] tool ${block.name}`, block.input);
				}
				const result = await runTool(block.name, block.input, userId);
				const isError =
					typeof result === "object" && result !== null && "error" in result;
				toolResults.push({
					type: "tool_result",
					tool_use_id: block.id,
					content: JSON.stringify(result),
					is_error: isError,
				});
			}
		}
		messages.push({ role: "user", content: toolResults });

		counter++;
	}
	messages.push({
		role: "assistant",
		content: "I couldn’t finish that. Please try a simpler question.",
	});

	return {
		text: "I couldn’t finish that. Please try a simpler question.",
		inputTokens: totalInputTokens,
		outputTokens: totalOutputTokens,
	};
}
