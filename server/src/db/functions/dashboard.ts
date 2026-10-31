import { Prisma } from "../../../generated/prisma/client";
import type { PaletteColor } from "../../../generated/prisma/enums";
import { getMonthBounds } from "../../lib/helpers";
import { prisma } from "../../lib/prisma";

export const dbGetIncomeOrExpenseStats = async (
	userId: string,
	month: string,
	type: "income" | "expense",
) => {
	const { startDate, endDate } = getMonthBounds(month);
	const data = await prisma.transaction.aggregate({
		where: {
			userId,
			type,
			transactionDate: {
				lte: endDate,
				gte: startDate,
			},
		},

		_sum: { amount: true },
	});

	return data;
};

export const dbGetCashflow = async (userId: string, month: string) => {
	const [yearPart, monthPart] = month.split("-");
	const anchorYear = Number(yearPart);
	const anchorMonth = Number(monthPart) - 1;

	const { endDate } = getMonthBounds(month);
	const start = new Date(Date.UTC(anchorYear, anchorMonth - 5, 1));

	const transactions = await prisma.transaction.findMany({
		where: {
			userId,
			type: { in: ["income", "expense"] },
			transactionDate: {
				lte: endDate,
				gte: start,
			},
		},
		select: { transactionDate: true, type: true, amount: true },
	});

	const skeleton = Array.from({ length: 6 }, (_, i) => {
		const d = new Date(Date.UTC(anchorYear, anchorMonth - 5 + i, 1));
		return {
			year: d.getUTCFullYear(),
			monthIndex: d.getUTCMonth(),
			income: 0,
			expense: 0,
		};
	});

	for (let i = 0; i < transactions.length; i++) {
		const bucket = skeleton.find(
			(b) =>
				b.year === transactions[i]?.transactionDate.getUTCFullYear() &&
				b.monthIndex === transactions[i]?.transactionDate.getUTCMonth(),
		);
		if (!bucket) continue;
		if (transactions[i]?.type === "expense") {
			bucket.expense += Number(transactions[i]?.amount);
		} else if (transactions[i]?.type === "income") {
			bucket.income += Number(transactions[i]?.amount);
		}
	}
	return skeleton;
};

export const dbSpendingByCategory = async (userId: string, month: string) => {
	const { startDate, endDate } = getMonthBounds(month);
	const accountTransactions = await prisma.transaction.groupBy({
		where: {
			userId,
			transactionDate: {
				gte: startDate,
				lte: endDate,
			},
			type: "expense",
			creditCardId: null,
		},
		by: ["categoryId"],
		_sum: { amount: true },
	});
	const cardTransactions = await prisma.cardTransaction.groupBy({
		where: {
			userId,
			transactionDate: {
				gte: startDate,
				lte: endDate,
			},
			cardTransactionType: "purchase",
		},
		by: ["categoryId"],
		_sum: { amount: true },
	});
	const spending: {
		categoryId: string | null;
		name: string;
		color: PaletteColor | null;
		total: number;
	}[] = [];
	const categories = await prisma.category.findMany({
		where: { userId },
	});
	for (const item of accountTransactions) {
		const category = categories.find((i) => i.id === item.categoryId);
		const key = category?.id ?? null;
		const foundSpending = spending.find((i) => i.categoryId === key);

		if (!foundSpending) {
			spending.push({
				categoryId: key,
				name: category?.name ?? "Uncategorised",
				color: category?.color ?? null,
				total: Number(item._sum.amount),
			});
		} else {
			foundSpending.total += Number(item._sum.amount);
		}
	}
	for (const item of cardTransactions) {
		const category = categories.find((i) => i.id === item.categoryId);
		const key = category?.id ?? null;
		const foundSpending = spending.find((i) => i.categoryId === key);

		if (!foundSpending) {
			spending.push({
				categoryId: key,
				name: category?.name ?? "Uncategorised",
				color: category?.color ?? null,
				total: Number(item._sum.amount),
			});
		} else {
			foundSpending.total += Number(item._sum.amount);
		}
	}

	return spending;
};

export const dbGetDebtStats = async (userId: string) => {
	const loanAmount = await prisma.loan.aggregate({
		where: { userId },
		_sum: { originalAmount: true },
	});
	const originalAmount =
		loanAmount._sum.originalAmount ?? new Prisma.Decimal(0);
	const loanTransactions = await prisma.transaction.aggregate({
		where: { userId, loanId: { not: null }, type: "expense" },
		_sum: { amount: true },
	});

	const outstandingLoan = (
		loanAmount._sum.originalAmount ?? new Prisma.Decimal(0)
	).minus(loanTransactions._sum.amount ?? new Prisma.Decimal(0));

	const cardLimitAndBalance = await prisma.creditCard.aggregate({
		where: { userId },
		_sum: { outstandingBalance: true, limit: true },
	});
	const balance =
		cardLimitAndBalance._sum.outstandingBalance ?? new Prisma.Decimal(0);
	const limit = cardLimitAndBalance._sum.limit ?? new Prisma.Decimal(0);

	return { originalAmount, outstandingLoan, balance, limit };
};

export const dbGetRecentTransactions = async (userId: string) => {
	const recentTransactions = await prisma.transaction.findMany({
		where: { userId },
		orderBy: [{ transactionDate: "desc" }, { statementRow: "desc" }],
		include: { category: { select: { name: true, color: true } }, account: {select: {name: true}} },
		take: 5,
	});

	return recentTransactions;
};
