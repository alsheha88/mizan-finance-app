import { NotFoundError } from "../../../errors/errors";
import type { Prisma } from "../../../generated/prisma/client";
import type { CardTransactionType } from "../../../generated/prisma/enums";
import {
	formatCardDate,
	getMonthBounds,
	normaliseMerchant,
	stripCommas,
	stripUndefined,
} from "../../lib/helpers";
import { prisma } from "../../lib/prisma";
import type { CardStatementRow } from "../../parser/creditCardStatementParser";
import type {
	CreateCardData,
	UpdateCardData,
	UpdateCardTransaction,
} from "../../schema/creditCardsSchema";
import type { CardTransactionsOptions } from "../../schema/querySchema";
import { dbGetCategory } from "./categories";

export type CardTransaction = {
	transactionDate: Date;
	amount: string;
	merchant: string;
	categoryId?: string | null;
	creditCardId: string;
	description: string;
	userId: string;
	cardTransactionType: CardTransactionType;
	merchantKey: string | null;
	statementRow: number;
};

export const dbGetCreditCards = async (userId: string) => {
	return await prisma.creditCard.findMany({ where: { userId } });
};
export const dbGetCreditCard = async (id: string, userId: string) => {
	return await prisma.creditCard.findFirst({ where: { userId, id } });
};
export const dbCreateCreditCard = async (
	userId: string,
	data: CreateCardData,
) => {
	const installmentPercentage =
		data.type === "fullDeduction" ? null : (data.installmentPercentage ?? null);
	return await prisma.creditCard.create({
		data: {
			userId,
			expiryDate: data.expiryDate,
			creditLimit: data.creditLimit,
			type: data.type,
			cardLast4: data.cardLast4,
			outstandingBalance: data.outstandingBalance,
			name: data.name,
			installmentPercentage,
		},
	});
};

export const dbUpdateCreditCard = async (
	id: string,
	userId: string,
	card: UpdateCardData,
) => {
	const data = stripUndefined({
		name: card.name,
		type: card.type,
		creditLimit: card.creditLimit,
		expiryDate: card.expiryDate,
		outstandingBalance: card.outstandingBalance,
		outstandingBalanceUpdatedAt:
			card.outstandingBalance !== undefined ? new Date() : undefined,
		installmentPercentage:
			card.type === "fullDeduction" ? null : card.installmentPercentage,
	});
	return await prisma.creditCard.updateManyAndReturn({
		where: { userId, id },
		data,
	});
};

export const dbDeleteCreditCard = async (id: string, userId: string) => {
	return await prisma.creditCard.deleteMany({ where: { userId, id } });
};

// Card Transactions
export const dbCreateCardTransaction = async (
	userId: string,
	data: CardStatementRow[],
	creditCardId: string,
) => {
	const merchantMemories = await prisma.merchantMemory.findMany({
		where: { userId },
	});
	const merchantMemoriesMap = new Map<string, string>(
		merchantMemories.map(({ merchantKey, categoryId }) => [
			merchantKey,
			categoryId,
		]),
	);

	const cardTransactions: CardTransaction[] = data.map((i, index) => {
		const cardTransactionType = i.description.includes(
			"PAYMENT RECEIVED - THANK YOU",
		)
			? "payment"
			: "purchase";
		const merchantKey =
			cardTransactionType === "purchase"
				? (normaliseMerchant(i.description) ?? null)
				: null;
		const rememberedCategoryId =
			merchantKey && merchantMemoriesMap.get(merchantKey);

		return {
			merchant: i.description,
			description: i.description,
			transactionDate: formatCardDate(i.date),
			userId,
			cardTransactionType: cardTransactionType,
			amount: stripCommas(i.amount),
			creditCardId,
			merchantKey: merchantKey,
			categoryId: rememberedCategoryId ?? null,
			statementRow: index,
		};
	});
	const created = await prisma.cardTransaction.createManyAndReturn({
		data: cardTransactions,
		skipDuplicates: true,
	});
	const skipped = cardTransactions.length - created.length;
	return { created, skipped };
};

export const dbUpdateCardTransaction = async (
	id: string,
	userId: string,
	transaction: UpdateCardTransaction,
) => {
	const data = Object.fromEntries(
		Object.entries(transaction).filter(([, v]) => v !== undefined),
	);

	if (transaction.categoryId !== undefined) {
		const category = await dbGetCategory(transaction.categoryId, userId);
		if (!category) throw new NotFoundError("Category not found");
	}
	const updatedTransaction = await prisma.cardTransaction.updateManyAndReturn({
		where: { id, userId },
		data: {
			...data,
			...(transaction.merchant !== undefined && { isEdited: true }),
		},
		include: {
			category: { select: { name: true, color: true } },
			card: { select: { name: true } },
		},
	});

	const row = updatedTransaction[0];

	if (!row || !row.categoryId || !row.merchantKey) return updatedTransaction;

	const { merchantKey, categoryId } = row;

	await prisma.merchantMemory.upsert({
		where: { userId_merchantKey: { userId, merchantKey } },
		create: { userId, merchantKey, categoryId },
		update: { categoryId },
	});
	await prisma.cardTransaction.updateMany({
		where: { userId, merchantKey, categoryId: null },
		data: { categoryId },
	});

	return updatedTransaction;
};

export const dbGetCardTransactions = async (
	options: CardTransactionsOptions,
	userId: string,
) => {
	const where: Prisma.CardTransactionWhereInput = { userId };
	const skip = (options.page - 1) * options.limit;
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
		const { startDate, nextMonthStart } = getMonthBounds(options.month);
		where.transactionDate.gte = startDate;
		where.transactionDate.lt = nextMonthStart;
	}
	const [transactions, count] = await Promise.all([
		prisma.cardTransaction.findMany({
			where,
			take: options.limit,
			skip,
			orderBy: [{ transactionDate: "desc" }, { id: "desc" }],
			include: {
				category: { select: { name: true, color: true } },
				card: { select: { name: true } },
			},
		}),
		prisma.cardTransaction.count({ where }),
	]);
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
