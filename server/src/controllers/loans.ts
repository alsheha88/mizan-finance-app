import type { RequestHandler } from "express";
import {
	dbCreateLoan,
	dbDeleteLoan,
	dbGetLoan,
	dbGetLoanByInvoiceNumber,
	dbGetLoans,
	dbUpdateLoan,
} from "../db/functions/loans";
import { idParamsSchema } from "../schema/userSchema";
import {
	ConflictError,
	NotFoundError,
	ValidationError,
} from "../../errors/errors";
import { createLoanSchema, editLoanSchema } from "../schema/loansSchema";
import { dbMatchTransactionToLoan } from "../db/functions/transactions";

export const getLoans: RequestHandler = async (req, res) => {
	const userId = req.user.id;

	const loans = await dbGetLoans(userId);

	res.status(200).json({ data: { loans } });
};
export const getLoan: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate loan id",
			parsedId.error.issues,
		);
	const id = parsedId.data.id;

	const loan = await dbGetLoan(id, userId);
	if (!loan) throw new NotFoundError("Loan not found");

	res.status(200).json({ data: { loan } });
};
export const createLoan: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const validateRequest = createLoanSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Failed to validate input data",
			validateRequest.error.issues,
		);
	const existingLoan = await dbGetLoanByInvoiceNumber(
		validateRequest.data.invoiceNumber,
		userId,
	);
	if (existingLoan)
		throw new ConflictError(
			"There is already a loan with the same invoice number",
		);

	const loan = await dbCreateLoan(userId, validateRequest.data);
	await dbMatchTransactionToLoan(userId);

	res.status(201).json({ data: { loan } });
};
export const editLoan: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate loan id",
			parsedId.error.issues,
		);
	const id = parsedId.data.id;
	const validateRequest = editLoanSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Failed to validate input data",
			validateRequest.error.issues,
		);

	const loan = await dbUpdateLoan(id, userId, validateRequest.data);
	if (loan.length === 0) throw new NotFoundError("Loan not found");

	res.status(200).json({ data: { loan: loan[0] } });
};
export const deleteLoan: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate loan id",
			parsedId.error.issues,
		);
	const id = parsedId.data.id;

	const loan = await dbDeleteLoan(id, userId);
	if (loan.count === 0) throw new NotFoundError("Loan not found");

	res.status(200).json({ data: { message: "Loan deleted successfully" } });
};
