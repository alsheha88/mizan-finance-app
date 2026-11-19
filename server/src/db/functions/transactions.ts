import { randomUUID } from "crypto";
import {
	Prisma,
	type MerchantMemory,
	type RowType,
} from "../../../generated/prisma/client";
import { type TransactionType } from "../../../generated/prisma/enums";
import {
	extractMCC,
	formatDate,
	formatToKuwaitMonth,
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
import { NotFoundError } from "../../../errors/errors";
import { dbGetCategory } from "./categories";
import { dbGetLoan } from "./loans";
import { dbGetCreditCard } from "./creditCards";

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
	if (options.uncategorised) {
		where.categoryId = null;
	} else if (options.categoryId !== undefined) {
		where.categoryId = options.categoryId;
	}
	if (options.accountId !== undefined) where.accountId = options.accountId;
	if (options.minAmount !== undefined || options.maxAmount !== undefined) {
		where.amount = {};
		if (options.maxAmount !== undefined) {
			where.amount.lte = options.maxAmount;
		}
		if (options.minAmount !== undefined) {
			where.amount.gte = options.minAmount;
		}
	}
	if (options.month) {
		where.transactionDate = {};
		const { startDate, nextMonthStart } = getMonthBounds(options.month);
		where.transactionDate.lt = nextMonthStart;
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
			{
				category: { name: { contains: options.search, mode: "insensitive" } },
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

	if (transaction.categoryId !== undefined) {
		const category = await dbGetCategory(transaction.categoryId, userId);
		if (!category) throw new NotFoundError("Category not found");
	}
	if (transaction.loanId !== undefined) {
		const loan = await dbGetLoan(transaction.loanId, userId);
		if (!loan) throw new NotFoundError("Loan not found");
	}
	if (transaction.creditCardId !== undefined) {
		const card = await dbGetCreditCard(userId, transaction.creditCardId);
		if (!card) throw new NotFoundError("Credit card not found");
	}

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

export const dbGetAvailableMonths = async (userId: string) => {
	const [accountAvailableMonths, cardAvailableMonths] = await Promise.all([
		prisma.transaction.findMany({
			where: { userId },
			select: { transactionDate: true },
		}),
		prisma.cardTransaction.findMany({
			where: { userId },
			select: { transactionDate: true },
		}),
	]);
	const accountFormattedMonths = accountAvailableMonths.map((i) =>
		formatToKuwaitMonth(i.transactionDate),
	);
	const cardFormattedMonths = cardAvailableMonths.map((i) =>
		formatToKuwaitMonth(i.transactionDate),
	);

	const monthsSet = new Set([
		...accountFormattedMonths,
		...cardFormattedMonths,
	]);
	const availableMonths = [...monthsSet].sort((a, b) => b.localeCompare(a));
	return availableMonths;
};

export const dbGetSalaryRows = async (userId: string, count: number) => {
	const transactions = await prisma.transaction.findMany({
		where: { userId, type: "income", rowType: "salary" },
		orderBy: [{ transactionDate: "desc" }, { statementRow: "desc" }],
		take: count + 1,
		select: {
			transactionDate: true,
			statementRow: true,
			amount: true,
			accountId: true,
		},
	});
	const salaryTransactions = transactions.map((i) => {
		return {
			...i,
			amount: Number(i.amount),
		};
	});

	return salaryTransactions;
};

export const dbGetSalaryCycleTotals = async (
	userId: string,
	start: { transactionDate: Date; statementRow: number; accountId: string },
	end: {
		transactionDate: Date;
		statementRow: number;
		accountId: string;
	} | null,
) => {
	const afterStart: Prisma.TransactionWhereInput[] = [
		{ transactionDate: { gt: start.transactionDate } },
		{
			transactionDate: start.transactionDate,
			statementRow: { gt: start.statementRow },
			accountId: start.accountId,
		},
		{
			transactionDate: start.transactionDate,
			accountId: { not: start.accountId },
		},
	];

	const conditions: Prisma.TransactionWhereInput[] = [{ OR: afterStart }];
	const cardConditions: Prisma.CardTransactionWhereInput = { userId };
	cardConditions.transactionDate = {};
	cardConditions.transactionDate.gte = start.transactionDate;
	cardConditions.cardTransactionType = "purchase";

	if (end) {
		conditions.push({
			OR: [
				{ transactionDate: { lt: end.transactionDate } },
				{
					transactionDate: end.transactionDate,
					statementRow: { lt: end.statementRow },
					accountId: end.accountId,
				},
			],
		});
		cardConditions.transactionDate.lt = end.transactionDate;
	}

	const inCycle: Prisma.TransactionWhereInput = {
		userId,
		AND: conditions,
	};

	const [
		otherIncome,
		loanInstallments,
		bankSpending,
		cardSpending,
		loansReceived,
		loanPayoffs,
	] = await Promise.all([
		prisma.transaction.aggregate({
			where: {
				...inCycle,
				rowType: { notIn: ["salary", "financing"] },
				type: "income",
			},
			_sum: { amount: true },
		}),
		prisma.transaction.aggregate({
			where: { ...inCycle, rowType: "loan_installment", type: "expense" },
			_sum: { amount: true },
		}),
		prisma.transaction.aggregate({
			where: {
				...inCycle,
				rowType: {
					notIn: ["loan_installment", "loan_payoff"],
				},
				type: "expense",
			},
			_sum: { amount: true },
		}),
		prisma.cardTransaction.aggregate({
			where: { ...cardConditions },
			_sum: { amount: true },
		}),
		prisma.transaction.aggregate({
			where: {
				...inCycle,
				rowType: "financing",
				type: "income",
			},
			_sum: { amount: true },
		}),
		prisma.transaction.aggregate({
			where: {
				...inCycle,
				rowType: "loan_payoff",
				type: "expense",
			},
			_sum: { amount: true },
		}),
	]);
	const result = {
		otherIncome: Number(otherIncome._sum.amount ?? 0),
		loanInstallments: Number(loanInstallments._sum.amount ?? 0),
		bankSpending: Number(bankSpending._sum.amount ?? 0),
		cardSpending: Number(cardSpending._sum.amount ?? 0),
		loansReceived: Number(loansReceived._sum.amount ?? 0),
		loanPayoffs: Number(loanPayoffs._sum.amount ?? 0),
	};

	return result;
};
