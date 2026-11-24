import type { RequestHandler } from "express";
import { createRecurringPaymentSchema } from "../schema/recurringPayment";
import { NotFoundError, ValidationError } from "../../errors/errors";
import {
	dbCreateRecurringPayment,
	dbGetRecurringPayments,
} from "../db/functions/recurringPayment";
import {
	dueDateInCycle,
	paymentStatus,
	type PaymentSettings,
} from "../lib/recurringPayments";

export const createRecurringPayment: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const validateRequest = createRecurringPaymentSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Failed to validate input data",
			validateRequest.error.issues,
		);
	const recurringPayment = await dbCreateRecurringPayment(
		userId,
		validateRequest.data,
	);
	if (!recurringPayment)
		throw new NotFoundError(
			"Transaction not found or already linked to a recurring payment",
		);

	res.status(201).json({ data: { recurringPayment } });
};

export const getRecurringPayments: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const now = new Date();
	const today = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
	);
	const { recurringPayments, cycle, dataUntil } = await dbGetRecurringPayments(
		userId,
		today,
	);
	const payments = recurringPayments.map((payment) => {
		const dueDate = dueDateInCycle(payment.expectedDay, cycle.start);
		const linked = [...payment.transactions, ...payment.cardTransactions].map(
			(i) => {
				return {
					amount: i.amount.times(1000).toNumber(),
					date: i.transactionDate,
				};
			},
		);

		const paymentSettings: PaymentSettings = {
			expectedAmount: payment.expectedAmount.times(1000).toNumber(),
			isActive: payment.isActive,
			amountVaries: payment.amountVaries,
		};
		const result = paymentStatus(
			paymentSettings,
			dueDate,
			linked,
			dataUntil,
			today,
		);

		return {
			id: payment.id,
			name: payment.name,
			expectedDay: payment.expectedDay,
			amountVaries: payment.amountVaries,
			isActive: payment.isActive,
			categoryId: payment.categoryId,
			expectedAmount: payment.expectedAmount.toNumber(),
			dueDate,
			status: result.status,
			paidOn: result.paidOn,
			priceChange:
				result.priceChange === null ? null : result.priceChange / 1000,
			paidAmount: result.paidAmount === null ? null : result.paidAmount / 1000,
		};
	});

	const totalFils = payments
		.filter((p) => p.isActive)
		.reduce((acc, b) => acc + Math.round(b.expectedAmount * 1000), 0);
	const total = totalFils / 1000;

	res.status(200).json({ data: { cycle, payments, total } });
};
