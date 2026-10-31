import type { RequestHandler } from "express";
import { queryParamsSchema } from "../schema/querySchema";
import { NotFoundError, ValidationError } from "../../errors/errors";
import {
	dbDeleteTransactions,
	dbGetTransaction,
	dbGetTransactions,
	dbUpdateTransaction,
} from "../db/functions/transactions";
import { updatedTransactionSchema } from "../schema/transactionsSchema";
import { idParamsSchema } from "../schema/userSchema";

export const getTransactions: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const queryParams = queryParamsSchema.safeParse(req.query);
	if (!queryParams.success)
		throw new ValidationError(
			"Couldn't validate query data",
			queryParams.error.issues,
		);
	const { transactions, count } = await dbGetTransactions(
		queryParams.data,
		userId,
	);

	res.status(200).json({ data: { transactions, count } });
};

export const editTransaction: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate transaction id",
			parsedId.error.issues,
		);
	const id = parsedId.data.id;
	const validateRequest = updatedTransactionSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Couldn't validate input data",
			validateRequest.error.issues,
		);
	const updatedTransaction = await dbUpdateTransaction(
		id,
		userId,
		validateRequest.data,
	);
	if (updatedTransaction.length === 0)
		throw new NotFoundError("Transaction not found");

	res.status(200).json({ data: { transaction: updatedTransaction[0] } });
};
export const getTransaction: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate transaction id",
			parsedId.error.issues,
		);
	const id = parsedId.data.id;

	const transaction = await dbGetTransaction(id, userId);
	if (!transaction) throw new NotFoundError("Transaction not found");

	res.status(200).json({ data: { transaction } });
};
export const deleteTransactions: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate transaction id",
			parsedId.error.issues,
		);
	const accountId = parsedId.data.id;

	const transaction = await dbDeleteTransactions(accountId, userId);
	if (transaction.count === 0)
		throw new NotFoundError("No transactions found linked to this account");

	res
		.status(200)
		.json({ data: { message: "Transactions deleted successfully" } });
};
