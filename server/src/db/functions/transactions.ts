import { randomUUID } from "crypto";
import type {
	MerchantMemory,
	Prisma,
	RowType,
} from "../../../generated/prisma/client";
import { type TransactionType } from "../../../generated/prisma/enums";
import {
	extractMCC,
	formatDate,
	getMerchant,
	getMonthBounds,
	getRowType,
	normaliseMerchant,
	stripCommas,
} from "../../lib/helpers";
import { prisma } from "../../lib/prisma";
import { type AccountStatementRow } from "../../parser/accountStatementParser";
import type { TransactionsOptions } from "../../schema/querySchema";
import type { UpdateTransaction } from "../../schema/transactionsSchema";
import {
	MCC_CATEGORIES,
	NON_MCC_CATEGORIES_MAP,
	ROW_TYPE_LABELS,
} from "../../lib/pdfConfig";

const TRANSFER_ROW_TYPES: RowType[] = ["own_transfer", "credit_card_payment"];

export const dbCreateTransaction = async (
	data: AccountStatementRow[],
	userId: string,
	accountId: string,
) => {
	const categories = await prisma.category.findMany({
		where: { userId },
	});
	const merchantMemories = await prisma.merchantMemory.findMany({
		where: { userId },
	});
	const merchantMemoriesMap = new Map<MerchantMemory["merchantKey"], string>(
		merchantMemories.map(({ merchantKey, categoryId }) => [
			merchantKey,
			categoryId,
		]),
	);
	const transactions: Prisma.TransactionCreateManyInput[] = data.map(
		(i, index) => {
			const rowType = getRowType(i.description);
			const merchant = getMerchant(i.description, rowType);
			const merchantKey =
				(rowType === "debit_card_purchase" || rowType === "pos_purchase") &&
				merchant !== ROW_TYPE_LABELS[rowType]
					? (normaliseMerchant(merchant) ?? null)
					: null;
			const isCredit = Boolean(Number(stripCommas(i.credit)));

			const mcc = extractMCC(i.description, rowType);
			const categoryId = merchantKey && merchantMemoriesMap.get(merchantKey);
			const categoryName =
				MCC_CATEGORIES[mcc ?? ""] ?? NON_MCC_CATEGORIES_MAP[rowType];
			const category = categoryName
				? categories.find((c) => c.name === categoryName)
				: undefined;
			const type: TransactionType = TRANSFER_ROW_TYPES.includes(rowType)
				? "transfer"
				: isCredit
					? "income"
					: "expense";

			return {
				transactionDate: formatDate(i.date),
				amount: isCredit ? stripCommas(i.credit) : stripCommas(i.debit),
				balanceAfter: stripCommas(i.balance),
				merchant: merchant,
				description: i.description,
				userId,
				accountId,
				type,
				statementRow: index,
				rowType,
				categoryId: categoryId ?? category?.id ?? null,
				merchantKey,
			};
		},
	);

	const created = await prisma.transaction.createManyAndReturn({
		data: transactions,
		skipDuplicates: true,
	});

	if (created.length !== transactions.length) {
		console.warn(
			`[upload] skipped ${transactions.length - created.length} of ${transactions.length} rows as duplicates — accountId ${accountId}`,
		);
	}

	return { created, skipped: transactions.length - created.length };
};

export const dbGetTransactions = async (
	options: TransactionsOptions,
	userId: string,
) => {
	const where: Prisma.TransactionWhereInput = { userId };
	const skip = (options.page - 1) * options.limit;

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
	const [transactions, count] = await Promise.all([
		prisma.transaction.findMany({
			where,
			take: options.limit,
			skip,
			orderBy: [{ transactionDate: "desc" }, { statementRow: "desc" }],
			include: {
				category: { select: { name: true, color: true } },
				account: { select: { name: true } },
			},
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

	const updatedTransaction = await prisma.transaction.updateManyAndReturn({
		where: { id, userId },
		data: {
			...data,
			...(transaction.merchant !== undefined && { isEdited: true }),
		},
		include: { category: { select: { name: true, color: true } } },
	});

	const row = updatedTransaction[0];

	if (!row || !row.categoryId || !row.merchantKey) return updatedTransaction;

	const { merchantKey, categoryId } = row;

	await prisma.merchantMemory.upsert({
		where: { userId_merchantKey: { userId, merchantKey } },
		create: { userId, merchantKey, categoryId },
		update: { categoryId },
	});

	await prisma.transaction.updateMany({
		where: { userId, merchantKey, categoryId: null },
		data: { categoryId },
	});

	return updatedTransaction;
};

export const dbMatchTransactionToLoan = async (userId: string) => {
	const transactions = await prisma.transaction.findMany({
		where: {
			userId,
			description: {
				contains: "Invoice No.",
				mode: "insensitive",
			},
			type: "expense",
			loanId: null,
		},
	});

	const invoices = transactions.map((i) => {
		const invoiceNumber = i.description.match(/Invoice No\.\s*(\d+)/);
		if (!invoiceNumber) return null;
		return {
			transactionId: i.id,
			invoiceNumber: invoiceNumber[1],
		};
	});

	const filteredInvoices = invoices.filter((i) => i !== null);
	const numbers = filteredInvoices.map((i) => i.invoiceNumber ?? "");

	const loans = await prisma.loan.findMany({
		where: { userId, invoiceNumber: { in: numbers } },
	});
	for (const invoice of filteredInvoices) {
		const loan = loans.find((i) => i.invoiceNumber === invoice.invoiceNumber);
		if (!loan) continue;

		await prisma.transaction.update({
			where: { id: invoice.transactionId },
			data: {
				loanId: loan.id,
			},
		});
	}
};

export const dbAccountToAccountTransfers = async (userId: string) => {
	// 1. The user's own accounts — needed to tell "my account" from someone else's
	const accounts = await prisma.account.findMany({ where: { userId } });

	// 2. Every row the parser classified as a transfer between accounts
	const transactions = await prisma.transaction.findMany({
		where: { userId, rowType: "own_transfer", transferGroupId: null },
	});

	// 3. Keep only what pairing needs, and drop rows we can't pair
	const transfers = transactions
		.map((t) => {
			const match = t.description.match(/(To|From) Account\s*(\d+)/);
			if (!match) return null;

			const number = match[2];
			if (!number) return null;

			const other = accounts.find((a) => a.accountNumber === number);

			return {
				id: t.id,
				ownAccountId: t.accountId,
				otherAccountId: other?.id ?? null,
				direction: match[1] === "From" ? "from" : "to",
				date: t.transactionDate,
				amount: t.amount,
			};
		})
		.filter((t) => t !== null);

	// 4. Two piles
	const outgoing = transfers.filter((t) => t.direction === "to");
	const incoming = transfers.filter((t) => t.direction === "from");

	// 5. For each outgoing row, find its incoming twin
	const updates: Prisma.PrismaPromise<unknown>[] = [];
	const used = new Set<string>();
	const expenseIds: string[] = [];
	const incomeIds: string[] = [];

	for (const t of transfers) {
		if (t.otherAccountId) continue;
		if (t.direction === "to") {
			expenseIds.push(t.id);
		} else {
			incomeIds.push(t.id);
		}
	}

	if (expenseIds.length > 0) {
		updates.push(
			prisma.transaction.updateMany({
				where: { id: { in: expenseIds } },
				data: { type: "expense" },
			}),
		);
	}

	if (incomeIds.length > 0) {
		updates.push(
			prisma.transaction.updateMany({
				where: { id: { in: incomeIds } },
				data: { type: "income" },
			}),
		);
	}

	for (const out of outgoing) {
		const partner = incoming.find(
			(inc) =>
				!used.has(inc.id) &&
				inc.ownAccountId === out.otherAccountId &&
				inc.otherAccountId === out.ownAccountId &&
				inc.date.getTime() === out.date.getTime() &&
				inc.amount.equals(out.amount),
		);

		if (!partner) continue;

		used.add(partner.id);

		const groupId = randomUUID();

		updates.push(
			prisma.transaction.update({
				where: { id: out.id },
				data: { transferGroupId: groupId, type: "transfer" },
			}),
			prisma.transaction.update({
				where: { id: partner.id },
				data: { transferGroupId: groupId, type: "transfer" },
			}),
		);
	}

	// 6. One round trip
	if (updates.length === 0) return 0;

	await prisma.$transaction(updates);

	return updates.length;
};
export const dbMatchCardPayments = async (userId: string) => {
	const transactions = await prisma.transaction.findMany({
		where: { userId, rowType: "credit_card_payment", creditCardId: null },
	});

	const filteredList = transactions.map((i) => {
		const cardNumber = i.description.match(/x+(\d{4})/);
		if (!cardNumber) return null;
		return {
			id: i.id,
			cardNumber: cardNumber[1],
		};
	});
	const cleanList = filteredList.filter((i) => i !== null);
	const cards = await prisma.creditCard.findMany({ where: { userId } });

	// Group the matched rows by card so each card needs one statement, not one per row
	const idsByCard = new Map<string, string[]>();

	for (const item of cleanList) {
		const card = cards.find((i) => i.cardNumber === item.cardNumber);
		if (!card) continue;
		const ids = idsByCard.get(card.id) ?? [];
		ids.push(item.id);
		idsByCard.set(card.id, ids);
	}

	const updates: Prisma.PrismaPromise<unknown>[] = [];

	for (const [creditCardId, ids] of idsByCard) {
		updates.push(
			prisma.transaction.updateMany({
				where: { userId, id: { in: ids } },
				data: { creditCardId },
			}),
		);
	}

	if (updates.length === 0) return 0;

	await prisma.$transaction(updates);

	return [...idsByCard.values()].reduce((sum, ids) => sum + ids.length, 0);
};

export const dbDeleteTransactions = async (
	accountId: string,
	userId: string,
) => {
	return await prisma.transaction.deleteMany({ where: { accountId, userId } });
};
