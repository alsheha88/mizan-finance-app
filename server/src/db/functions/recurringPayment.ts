import {
	calendarMonthCycle,
	stripUndefined,
	toMatchKey,
} from "../../lib/helpers";
import { prisma } from "../../lib/prisma";
import { getCycle } from "../../lib/recurringPayments";
import type { CreateRecurringPaymentData } from "../../schema/recurringPayment";
import { dbGetSalaryRows } from "./transactions";

export const dbCreateRecurringPayment = async (
	userId: string,
	data: CreateRecurringPaymentData,
) => {
	const transaction =
		data.source === "bank"
			? await prisma.transaction.findFirst({
					where: {
						userId,
						id: data.transactionId,
						type: "expense",
						recurringPaymentId: null,
					},
				})
			: await prisma.cardTransaction.findFirst({
					where: {
						userId,
						id: data.transactionId,
						cardTransactionType: "purchase",
						recurringPaymentId: null,
					},
				});
	if (!transaction) return null;
	const matchKey = toMatchKey(transaction.merchant);
	const recurringPayment = await prisma.$transaction(async (tx) => {
		const created = await tx.recurringPayment.create({
			data: {
				name: data.name,
				expectedAmount: data.expectedAmount,
				expectedDay: data.expectedDay,
				categoryId: data.categoryId ?? null,
				matchKey,
				amountVaries: data.amountVaries ?? false,
				userId,
			},
		});
		if (data.source === "bank") {
			await tx.transaction.updateMany({
				where: { userId, id: data.transactionId },
				data: { recurringPaymentId: created.id },
			});
		} else {
			await tx.cardTransaction.updateMany({
				where: { userId, id: data.transactionId },
				data: { recurringPaymentId: created.id },
			});
		}

		return created;
	});
	return recurringPayment;
};

export const dbGetRecurringPayments = async (userId: string, today: Date) => {
	const [salaryRows, bankMax, cardMax] = await Promise.all([
		dbGetSalaryRows(userId, 0),
		prisma.transaction.aggregate({
			where: { userId },
			_max: { transactionDate: true },
		}),
		prisma.cardTransaction.aggregate({
			where: { userId },
			_max: { transactionDate: true },
		}),
	]);

	const dates = [
		bankMax._max.transactionDate,
		cardMax._max.transactionDate,
	].filter((d): d is Date => d !== null);
	const dataUntil =
		dates.length > 0
			? new Date(Math.max(...dates.map((d) => d.getTime())))
			: null;

	const latestSalary = salaryRows[0];
	const cycle = latestSalary
		? getCycle(latestSalary.transactionDate)
		: calendarMonthCycle(today);

	const inCycle = { transactionDate: { gte: cycle.start, lte: cycle.end } };
	const recurringPayments = await prisma.recurringPayment.findMany({
		where: { userId },
		include: {
			transactions: {
				where: inCycle,
				select: { transactionDate: true, amount: true },
			},
			cardTransactions: {
				where: inCycle,
				select: { transactionDate: true, amount: true },
			},
		},
		orderBy: { expectedDay: "asc" },
	});

	return { cycle, dataUntil, recurringPayments };
};
