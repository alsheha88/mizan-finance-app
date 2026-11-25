import type { RequestHandler } from "express";
import {
	createRecurringPaymentSchema,
	transactionLinkSchema,
	updateRecurringPaymentSchema,
} from "../schema/recurringPayment";
import { idParamsSchema } from "../schema/userSchema";
import { NotFoundError, ValidationError } from "../../errors/errors";
import {
	dbCreateRecurringPayment,
	dbDeleteRecurringPayment,
	dbGetRecurringPayments,
	dbLinkTransaction,
	dbMatchRecurringPayments,
	dbUnlinkTransaction,
	dbUpdateRecurringPayment,
} from "../db/functions/recurringPayment";
import { dueDateInCycle, paymentStatus } from "../lib/recurringPayments";
import type { PaymentSettings } from "../types/types";

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

	const linkedCount =await dbMatchRecurringPayments(userId, {
		kind: "backfill",
		recurringPaymentId: recurringPayment.id,
	});

	res.status(201).json({ data: { recurringPayment, linkedCount } },);
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
			dataUntil[payment.source],
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

export const updateRecurringPayment: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate recurring payment id",
			parsedId.error.issues,
		);
	const validateRequest = updateRecurringPaymentSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Failed to validate input data",
			validateRequest.error.issues,
		);

	const recurringPayment = await dbUpdateRecurringPayment(
		parsedId.data.id,
		userId,
		validateRequest.data,
	);
	if (!recurringPayment) throw new NotFoundError("Recurring payment not found");

	res.status(200).json({ data: { recurringPayment } });
};

export const deleteRecurringPayment: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate recurring payment id",
			parsedId.error.issues,
		);

	const result = await dbDeleteRecurringPayment(parsedId.data.id, userId);
	if (result.count === 0) throw new NotFoundError("Recurring payment not found");

	res
		.status(200)
		.json({ data: { message: "Recurring payment deleted successfully" } });
};

export const linkTransaction: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate recurring payment id",
			parsedId.error.issues,
		);
	const validateRequest = transactionLinkSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Failed to validate input data",
			validateRequest.error.issues,
		);

	const linked = await dbLinkTransaction(
		parsedId.data.id,
		userId,
		validateRequest.data,
	);
	if (linked === 0)
		throw new NotFoundError(
			"Recurring payment or transaction not found, the sources differ, or the transaction is already linked",
		);

	res.status(200).json({ data: { message: "Transaction linked" } });
};

export const unlinkTransaction: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const validateRequest = transactionLinkSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Failed to validate input data",
			validateRequest.error.issues,
		);

	const unlinked = await dbUnlinkTransaction(userId, validateRequest.data);
	if (unlinked === 0)
		throw new NotFoundError("Transaction not found or not linked");

	res.status(200).json({ data: { message: "Transaction unlinked" } });
};
