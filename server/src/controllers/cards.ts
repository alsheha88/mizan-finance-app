import type { RequestHandler } from "express";
import {
	dbCreateCreditCard,
	dbDeleteCreditCard,
	dbGetCardTransaction,
	dbGetCardTransactions,
	dbGetCreditCard,
	dbGetCreditCards,
	dbUpdateCardTransaction,
	dbUpdateCreditCard,
} from "../db/functions/creditCards";
import { idParamsSchema } from "../schema/userSchema";
import {
	ConflictError,
	NotFoundError,
	ValidationError,
} from "../../errors/errors";
import {
	createCardSchema,
	updateCardSchema,
	updateCardTransactionSchema,
} from "../schema/creditCardsSchema";
import { Prisma } from "../../generated/prisma/client";
import { cardQueryParamsSchema } from "../schema/querySchema";
import { dbMatchCardPayments } from "../db/functions/transactions";

export const getCreditCards: RequestHandler = async (req, res) => {
	const userId = req.user.id;

	const cards = await dbGetCreditCards(userId);

	res.status(200).json({ data: { cards } });
};
export const getCreditCard: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate card id",
			parsedId.error.issues,
		);
	const id = parsedId.data.id;

	const card = await dbGetCreditCard(userId, id);
	if (!card) throw new NotFoundError("Card not found");

	res.status(200).json({ data: { card } });
};
export const createCreditCard: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const validateRequest = createCardSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Failed to validate input data",
			validateRequest.error?.issues,
		);
	try {
		const card = await dbCreateCreditCard(userId, validateRequest.data);
		await dbMatchCardPayments(userId);
		res.status(201).json({ data: { card } });
	} catch (err) {
		if (
			err instanceof Prisma.PrismaClientKnownRequestError &&
			err.code === "P2002"
		)
			throw new ConflictError("You already have a card with this number");

		throw err;
	}
};

export const editCreditCard: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate card id",
			parsedId.error.issues,
		);
	const id = parsedId.data.id;
	const validateRequest = updateCardSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Failed to validate input data",
			validateRequest.error.issues,
		);
	const card = await dbUpdateCreditCard(userId, id, validateRequest.data);
	if (card.length === 0) throw new NotFoundError("Card not found");

	res.status(200).json({ data: { card: card[0] } });
};
export const deleteCreditCard: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate card id",
			parsedId.error.issues,
		);
	const id = parsedId.data.id;

	const card = await dbDeleteCreditCard(userId, id);
	if (card.count === 0) throw new NotFoundError("Card not found");

	res.status(200).json({ data: { message: "Card deleted successfully" } });
};

export const getCardTransactions: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const queryParams = cardQueryParamsSchema.safeParse(req.query);
	if (!queryParams.success)
		throw new ValidationError(
			"Couldn't validate query data",
			queryParams.error.issues,
		);
	const { transactions, count } = await dbGetCardTransactions(
		queryParams.data,
		userId,
	);

	res.status(200).json({ data: { transactions, count } });
};

export const getCardTransaction: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate transaction id",
			parsedId.error.issues,
		);
	const id = parsedId.data.id;

	const transaction = await dbGetCardTransaction(id, userId);
	if (!transaction) throw new NotFoundError("Transaction not found");

	res.status(200).json({ data: { transaction } });
};

export const editCardTransaction: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate transaction id",
			parsedId.error.issues,
		);
	const id = parsedId.data.id;
	const validateRequest = updateCardTransactionSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Couldn't validate input data",
			validateRequest.error.issues,
		);
	const updatedTransaction = await dbUpdateCardTransaction(
		id,
		userId,
		validateRequest.data,
	);
	if (updatedTransaction.length === 0)
		throw new NotFoundError("Transaction not found");

	res.status(200).json({ data: { transaction: updatedTransaction[0] } });
};
