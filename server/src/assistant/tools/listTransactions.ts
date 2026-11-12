import type Anthropic from "@anthropic-ai/sdk";
import { toJSONSchema } from "zod";
import { listTransactionsInput } from "../../schema/toolsSchema.js";
import { dbGetCategories, dbGetCategory } from "../../db/functions/categories.js";
import { dbGetTransactions } from "../../db/functions/transactions.js";
import { prisma } from "../../lib/prisma.js";
import { dbGetAccounts } from "../../db/functions/accounts.js";

export const listTransactionsToolDefinition = {
	name: "getTransactionsList",
	description:
		"Lists the user's individual bank account transactions, newest first, 20 per page. All filters are optional and can be combined: month (YYYY-MM), type (income, expense or transfer), category name, account name, merchant search, and amount range in KD. Use this tool only when the user wants to see specific transactions, for example 'show me my Talabat orders in October'. Do not use it to calculate totals: for spending per category use getSpendingByCategory, and for monthly income or expense totals use getMonthTotals. Returns the transactions for the requested page, plus count (the total number of transactions that matched), page, and totalPages. If there are more pages, tell the user how many transactions there are in total and offer to show the next page. To show the next page, call this tool again with the same filters and the next page number. Covers bank account transactions only; credit card statement purchases are not included.",
	input_schema: toJSONSchema(
		listTransactionsInput,
	) as Anthropic.Tool.InputSchema,
} satisfies Anthropic.Tool;

export async function getTransactionsList(input: unknown, userId: string) {
	const validateRequest = listTransactionsInput.safeParse(input);
	if (!validateRequest.success)
		return {
			error: "failed to validate input data",
			details: validateRequest.error.message,
		};
	let category;
	let account;
	if (validateRequest.data.category) {
		category = await prisma.category.findFirst({
			where: {
				userId,
				name: { equals: validateRequest.data.category, mode: "insensitive" },
			},
		});
		const categories = await dbGetCategories(userId);
		if (!category) {
			const categoriesNames = categories.map((i) => i.name);
			return {
				error: `Category ${validateRequest.data.category} not found`,
				availableCategories: categoriesNames,
			};
		}
	}
	if (validateRequest.data.account) {
		account = await prisma.account.findFirst({
			where: {
				userId,
				name: { equals: validateRequest.data.account, mode: "insensitive" },
			},
		});
		const accounts = await dbGetAccounts(userId);
		if (!account) {
			const accountsNames = accounts.map((i) => i.name);
			return {
				error: `Account ${validateRequest.data.account} not found`,
				availableAccounts: accountsNames,
			};
		}
	}
	const options = {
		month: validateRequest.data.month,
		search: validateRequest.data.search,
		maxAmount: validateRequest.data.maxAmount,
		minAmount: validateRequest.data.minAmount,
		page: validateRequest.data.page || 1,
		limit: 20,
		type: validateRequest.data.type,
		categoryId: category?.id,
		accountId: account?.id,
	};
	const data = await dbGetTransactions(options, userId);
	const transactions = data.transactions.map((i) => {
		return {
			merchant: i.merchant,
			type: i.type,
			date: i.transactionDate.toISOString().slice(0, 10),
			amount: Number(i.amount.toFixed(3)),
			category: i.category?.name ?? "Uncategorised",
			account: i.account.name,
		};
	});
	const totalPages = Math.ceil(data.count / options.limit);
	return {
		month: options.month,
		type: options.type,
		transactions,
		count: data.count,
		page: options.page,
		totalPages,
	};
}
