import type { RequestHandler } from "express";
import { createRecurringPaymentSchema } from "../schema/recurringPayment";
import { NotFoundError, ValidationError } from "../../errors/errors";
import { dbCreateRecurringPayment } from "../db/functions/recurringPayment";

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
	if (!recurringPayment) throw new NotFoundError("Transaction not found or already linked to a recurring payment");

	res.status(201).json({ data: { recurringPayment } });
};
