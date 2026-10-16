import type { RequestHandler } from "express";
import { dashboardQueryParamsSchema } from "../schema/querySchema";
import {
	dbGetIncomeOrExpenseStats,
	dbGetCashflow,
	dbSpendingByCategory,
	dbGetRecentTransactions,
	dbGetDebtStats,
} from "../db/functions/dashboard";
import { ValidationError } from "../../errors/errors";
import { Prisma } from "../../generated/prisma/client";

export const getDashboardStats: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const queryParams = dashboardQueryParamsSchema.safeParse(req.query);
	if (!queryParams.success)
		throw new ValidationError(
			"Failed to validate query params",
			queryParams.error.issues,
		);
	const month = queryParams.data.month;
	const [
		incomeStat,
		expensesStats,
		cashflow,
		spendingByCategory,
		debtStats,
		recentTransactions,
	] = await Promise.all([
		dbGetIncomeOrExpenseStats(userId, month, "income"),
		dbGetIncomeOrExpenseStats(userId, month, "expense"),
		dbGetCashflow(userId),
		dbSpendingByCategory(userId, month),
		dbGetDebtStats(userId),
		dbGetRecentTransactions(userId),
	]);
	const income = incomeStat._sum.amount ?? new Prisma.Decimal(0);
	const expenses = expensesStats._sum.amount ?? new Prisma.Decimal(0);
	const netCash = income.minus(expenses);

	res
		.status(200)
		.json({
			data: {
				income,
				expenses,
				netCash,
				cashflow,
				spendingByCategory,
				debtStats,
				recentTransactions,
			},
		});
};
