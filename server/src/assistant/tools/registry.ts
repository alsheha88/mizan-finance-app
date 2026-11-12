import type Anthropic from "@anthropic-ai/sdk";
import { debtStatusToolDefinition, getDebtStatus } from "./debtStatus.js";
import {
	getTransactionsList,
	listTransactionsToolDefinition,
} from "./listTransactions.js";
import { getMonthTotals, monthTotalsToolDefinition } from "./monthTotals.js";
import {
	getSpendingByCategory,
	spendingByCategoryToolDefinition,
} from "./spending.js";

export const toolRunners: Record<
	string,
	(input: unknown, userId: string) => Promise<unknown>
> = {
	getSpendingByCategory: getSpendingByCategory,
	getMonthTotals: getMonthTotals,
	getTransactionsList: getTransactionsList,
	getDebtStatus: getDebtStatus,
};

export const toolDefinitions = [
	spendingByCategoryToolDefinition,
	monthTotalsToolDefinition,
	listTransactionsToolDefinition,
	debtStatusToolDefinition,
];

export async function runTool(name: string, input: unknown, userId: string) {
	const runner = toolRunners[name];

	if (!runner)
		return {
			error: `Unknown tool name ${name}`,
		};

	const result = await runner(input, userId);

	return result;
}
