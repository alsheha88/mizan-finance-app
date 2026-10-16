import type { Prisma } from "../../../generated/prisma/client";
import type { CardTransactionType } from "../../../generated/prisma/enums";
import { formatCardDate, getMonthBounds, stripCommas } from "../../lib/helpers";
import { prisma } from "../../lib/prisma";
import type { CardStatementRow } from "../../parser/creditCardStatementParser";
import type {
	CreateCardData,
	UpdateCardData,
	UpdateCardTransaction,
} from "../../schema/creditCardsSchema";
import type { CardTransactionsOptions } from "../../schema/querySchema";

export type CardTransaction = {
	transactionDate: Date;
	amount: string;
	merchant: string;
	categoryId?: string | null;
	creditCardId: string;
	description: string;
	userId: string;
	cardTransactionType: CardTransactionType;
};

export const dbGetCreditCards = async (userId: string) => {
	return await prisma.creditCard.findMany({ where: { userId } });
};
export const dbGetCreditCard = async (userId: string, id: string) => {
	return await prisma.creditCard.findFirst({ where: { userId, id } });
};
export const dbCreateCreditCard = async (
	userId: string,
	data: CreateCardData,
) => {
	return await prisma.creditCard.create({
		data: {
			userId,
			expiryDate: data.expiryDate,
			limit: data.limit,
			type: data.type,
			cardNumber: data.cardNumber,
			outstandingBalance: data.outstandingBalance,
		},
	});
};

export const dbUpdateCreditCard = async (
	userId: string,
	id: string,
	card: UpdateCardData,
) => {
	const data = Object.fromEntries(
		Object.entries(card).filter(([, v]) => v !== undefined),
	);

	return await prisma.creditCard.updateManyAndReturn({
		where: { userId, id },
		data,
	});
};

export const dbDeleteCreditCard = async (userId: string, id: string) => {
	return await prisma.creditCard.deleteMany({ where: { userId, id } });
};

// Card Transactions
export const dbCreateCardTransaction = async (
	userId: string,
	data: CardStatementRow[],
	creditCardId: string,
) => {
	const cardTransactions: CardTransaction[] = data.map((i) => {
		return {
			merchant: i.description,
			description: i.description,
			transactionDate: formatCardDate(i.date),
			userId,
			cardTransactionType: i.description.includes(
				"PAYMENT RECEIVED - THANK YOU",
			)
				? "payment"
				: "purchase",
			amount: stripCommas(i.amount),
			creditCardId,
		};
	});
	return await prisma.cardTransaction.createManyAndReturn({
		data: cardTransactions,
	});
};

export const dbUpdateCardTransaction = async (
	id: string,
	userId: string,
	transaction: UpdateCardTransaction,
) => {
	const data = Object.fromEntries(
		Object.entries(transaction).filter(([, v]) => v !== undefined),
	);
	return await prisma.cardTransaction.updateManyAndReturn({
		where: { id, userId },
		data: {
			...data,
			...(transaction.merchant !== undefined && { isEdited: true }),
		},
	});
};

export const dbGetCardTransactions = async (
	options: CardTransactionsOptions,
	userId: string,
) => {
	const where: Prisma.CardTransactionWhereInput = { userId };
	const limit = 10;
	const skip = (options.page - 1) * limit;
	if (options.categoryId !== undefined) where.categoryId = options.categoryId;
	if (options.creditCardId !== undefined)
		where.creditCardId = options.creditCardId;
	if (options.type !== undefined) where.cardTransactionType = options.type;
	if (options.search !== undefined) {
		where.OR = [
			{
				merchant: { contains: options.search, mode: "insensitive" },
			},
			{
				description: { contains: options.search, mode: "insensitive" },
			},
		];
	}
	if (options.month) {
		where.transactionDate = {};
		const { startDate, endDate } = getMonthBounds(options.month);
		where.transactionDate.gte = startDate;
		where.transactionDate.lte = endDate;
	}
	const transactions = await prisma.cardTransaction.findMany({
		where,
		take: limit,
		skip,
		orderBy: [{ transactionDate: "desc" }, { id: "desc" }],
		include: { category: { select: { name: true, color: true } } },
	});
	const count = await prisma.cardTransaction.count({ where });

	// const [transactions, count] = await prisma.$transaction([
	// ]);
	return { transactions, count };
};

export const dbGetCardTransaction = async (id: string, userId: string) => {
	return await prisma.cardTransaction.findFirst({
		where: { id, userId },
		include: {
			category: { select: { name: true, color: true } },
		},
	});
};
export const dbDeleteCardTransaction = async (id: string, userId: string) => {
	return await prisma.cardTransaction.deleteMany({
		where: { id, userId },
	});
};
