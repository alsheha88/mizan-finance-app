import { Anthropic } from "@anthropic-ai/sdk";
import { getSystemPrompt } from "./prompts";
import { runTool, toolDefinitions } from "./tools/registry.js";
const client = new Anthropic();

export async function runAgent(
	messages: Anthropic.MessageParam[],
	userId: string,
): Promise<string> {
	let counter = 0;
	const MAX_STEPS = 8;
	let text = "";

	while (counter < MAX_STEPS) {
		console.log(`Step ${counter + 1}`);
		const toolResults: Anthropic.ToolResultBlockParam[] = [];
		const response = await client.messages.create({
			max_tokens: 2000,
			messages,
			model: "claude-haiku-5-5",
			system: getSystemPrompt(),
			thinking: { type: "disabled" },
			tools: toolDefinitions,
		});
		messages.push({ role: "assistant", content: response.content });
		console.log(response.stop_reason);
		console.log(`response_useage: {
                    input_Tokens: ${response.usage.input_tokens},
                    outpu_Tokens: ${response.usage.output_tokens},
                    }`);
		if (response.stop_reason !== "tool_use") {
			for (const block of response.content) {
				if (block.type === "text") {
					text += block.text;
				}
			}
			return text;
		}
		for (const block of response.content) {
			if (block.type === "tool_use") {
				console.log(`
                    block name: ${block.name},
                    input: ${JSON.stringify(block.input)}
                    `);
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

	return "I couldn’t finish that. Please try a simpler question.";
}
