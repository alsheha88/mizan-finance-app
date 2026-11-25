import type { PaymentSource } from "../../../generated/prisma/enums";
import {
	calendarMonthCycle,
	stripUndefined,
	toMatchKey,
} from "../../lib/helpers";
import { prisma } from "../../lib/prisma";
import { getCycle, matchRecurringPayments } from "../../lib/recurringPayments";
import type {
	CreateRecurringPaymentData,
	TransactionLinkData,
	UpdateRecurringPaymentData,
} from "../../schema/recurringPayment";
import type { MatchCandidate, MatchPayment } from "../../types/types";
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
				source: data.source,
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

	// Bank and card statements are uploaded separately and can reach different
	// dates, so each payment is judged only by its own source's data.
	const dataUntil = {
		bank: bankMax._max.transactionDate,
		card: cardMax._max.transactionDate,
	};

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

export type UploadMatch = {
	kind: "upload";
	source: PaymentSource;
	transactionIds: string[];
};

export type BackfillMatch = {
	kind: "backfill";
	recurringPaymentId: string;
};

export type MatchScope = UploadMatch | BackfillMatch;

export const dbMatchRecurringPayments = async (
	userId: string,
	scope: MatchScope,
) => {
	const candidateSelect = {
		id: true,
		merchant: true,
		transactionDate: true,
		amount: true,
	} as const;

	const [payments, bankRows, cardRows] = await Promise.all([
		prisma.recurringPayment.findMany({
			where: {
				userId,
				isActive: true,
				...(scope.kind === "backfill" && { id: scope.recurringPaymentId }),
			},
			include: {
				transactions: { select: { transactionDate: true } },
				cardTransactions: { select: { transactionDate: true } },
			},
		}),
		prisma.transaction.findMany({
			where: {
				userId,
				type: "expense",
				recurringPaymentId: null,
				...(scope.kind === "upload" && {
					id: { in: scope.source === "bank" ? scope.transactionIds : [] },
				}),
			},
			select: candidateSelect,
		}),
		prisma.cardTransaction.findMany({
			where: {
				userId,
				cardTransactionType: "purchase",
				recurringPaymentId: null,
				...(scope.kind === "upload" && {
					id: { in: scope.source === "card" ? scope.transactionIds : [] },
				}),
			},
			select: candidateSelect,
		}),
	]);

	const matchPayments: MatchPayment[] = payments.map((payment) => ({
		id: payment.id,
		source: payment.source,
		matchKey: payment.matchKey,
		expectedAmount: payment.expectedAmount.times(1000).toNumber(),
		expectedDay: payment.expectedDay,
		linkedDates: [...payment.transactions, ...payment.cardTransactions].map(
			(t) => t.transactionDate,
		),
	}));

	const toCandidate = (
		row: (typeof bankRows)[number],
		source: MatchCandidate["source"],
	): MatchCandidate => ({
		id: row.id,
		source,
		matchKey: toMatchKey(row.merchant),
		amount: row.amount.times(1000).toNumber(),
		date: row.transactionDate,
	});

	const candidates = [
		...bankRows.map((row) => toCandidate(row, "bank")),
		...cardRows.map((row) => toCandidate(row, "card")),
	];

	const decisions = matchRecurringPayments(matchPayments, candidates);
	if (decisions.length === 0) return 0;

	const updates = decisions.map((decision) =>
		decision.source === "bank"
			? prisma.transaction.updateMany({
					where: { id: decision.transactionId, userId },
					data: { recurringPaymentId: decision.recurringPaymentId },
				})
			: prisma.cardTransaction.updateMany({
					where: { id: decision.transactionId, userId },
					data: { recurringPaymentId: decision.recurringPaymentId },
				}),
	);

	await prisma.$transaction(updates);

	return decisions.length;
};

export const dbUpdateRecurringPayment = async (
	id: string,
	userId: string,
	data: UpdateRecurringPaymentData,
) => {
	const [updated] = await prisma.recurringPayment.updateManyAndReturn({
		where: { id, userId },
		data: stripUndefined(data),
	});
	return updated ?? null;
};

export const dbDeleteRecurringPayment = async (id: string, userId: string) => {
	// Linked transactions stay; the relation's onDelete: SetNull unlinks them.
	return await prisma.recurringPayment.deleteMany({ where: { id, userId } });
};

// Links one transaction by hand. Returns how many rows were linked (0 or 1):
// 0 when the payment or transaction isn't the user's, the sources differ,
// the transaction is the wrong kind, or it's already linked.
export const dbLinkTransaction = async (
	recurringPaymentId: string,
	userId: string,
	data: TransactionLinkData,
) => {
	const payment = await prisma.recurringPayment.findFirst({
		where: { id: recurringPaymentId, userId },
		select: { source: true },
	});
	if (!payment || payment.source !== data.source) return 0;

	const result =
		data.source === "bank"
			? await prisma.transaction.updateMany({
					where: {
						id: data.transactionId,
						userId,
						type: "expense",
						recurringPaymentId: null,
					},
					data: { recurringPaymentId },
				})
			: await prisma.cardTransaction.updateMany({
					where: {
						id: data.transactionId,
						userId,
						cardTransactionType: "purchase",
						recurringPaymentId: null,
					},
					data: { recurringPaymentId },
				});
	return result.count;
};

// Unlinks one transaction. Returns 0 when it isn't the user's or isn't linked.
export const dbUnlinkTransaction = async (
	userId: string,
	data: TransactionLinkData,
) => {
	const where = {
		id: data.transactionId,
		userId,
		recurringPaymentId: { not: null },
	};
	const result =
		data.source === "bank"
			? await prisma.transaction.updateMany({
					where,
					data: { recurringPaymentId: null },
				})
			: await prisma.cardTransaction.updateMany({
					where,
					data: { recurringPaymentId: null },
				});
	return result.count;
};
