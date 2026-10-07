import type { Prisma } from "../../../generated/prisma/client";
import { type TransactionType } from "../../../generated/prisma/enums";
import { formatDate, getMonthBounds, stripCommas } from "../../lib/helpers";
import { prisma } from "../../lib/prisma";
import { type StatementRow } from "../../parser/statement-parser";
import type { TransactionsOptions } from "../../schema/querySchema";
import type { UpdateTransaction } from "../../schema/transactionsSchema";

export type Transaction = {
	transactionDate: Date;
	amount: string;
	balanceAfter: string;
	merchant: string;
	transferGroupId?: string | null;
	categoryId?: string | null;
	description: string;
	userId: string;
	accountId: string;
	type: TransactionType;
	statementRow: number;
};

export const dbCreateTransaction = async (
	data: StatementRow[],
	userId: string,
	accountId: string,
) => {
	const transactions: Transaction[] = data.map((i, index) => {
		return {
			transactionDate: formatDate(i.date),
			amount: Number(stripCommas(i.credit))
				? stripCommas(i.credit)
				: stripCommas(i.debit),
			balanceAfter: stripCommas(i.balance),
			merchant: i.description,
			description: i.description,
			userId,
			accountId,
			type: Number(stripCommas(i.credit))
				? "income"
				: ("expense" as TransactionType),
			statementRow: index,
		};
	});

	return await prisma.transaction.createManyAndReturn({ data: transactions });
};

export const dbGetTransactions = async (
	options: TransactionsOptions,
	userId: string,
) => {
	const where: Prisma.TransactionWhereInput = { userId };
	const limit = 10;
	const skip = (options.page - 1) * limit;

	if (options.type !== undefined) where.type = options.type;
	if (options.categoryId !== undefined) where.categoryId = options.categoryId;
	if (options.accountId !== undefined) where.accountId = options.accountId;
	if (options.month) {
		where.transactionDate = {};
		const { startDate, endDate } = getMonthBounds(options.month);
		where.transactionDate.lte = endDate;
		where.transactionDate.gte = startDate;
	}
	if (options.search !== undefined)
		where.OR = [
			{
				merchant: {
					contains: options.search,
					mode: "insensitive",
				},
			},
			{
				description: {
					contains: options.search,
					mode: "insensitive",
				},
			},
		];
	const [transactions, count] = await prisma.$transaction([
		prisma.transaction.findMany({
			where,
			take: limit,
			skip,
			orderBy: [{ transactionDate: "desc" }, { statementRow: "desc" }],
			include: { category: { select: { name: true, color: true } } },
		}),
		prisma.transaction.count({ where }),
	]);
	return { transactions, count };
};

export const dbGetTransaction = async (id: string, userId: string) => {
	return await prisma.transaction.findFirst({
		where: { id, userId },
		include: {
			category: { select: { name: true, color: true } },
			loan: { select: { invoiceNumber: true } },
			creditCard: {
				select: { cardNumber: true },
			},
		},
	});
};
export const dbUpdateTransaction = async (
	id: string,
	userId: string,
	transaction: UpdateTransaction,
) => {
	const data = Object.fromEntries(
		Object.entries(transaction).filter(([, v]) => v !== undefined),
	);
	return await prisma.transaction.updateManyAndReturn({
		where: { id, userId },
		data: {
			...data,
			...(transaction.merchant !== undefined && { isEdited: true }),
		},
	});
};
