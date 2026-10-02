import type { RequestHandler } from "express";
import {
	createAccountSchema,
	editAccountSchema,
	isActiveSchema,
	type CreateAccountData,
} from "../schema/accountSchema";
import {
	ConflictError,
	NotFoundError,
	ValidationError,
} from "../../errors/errors";
import {
	dbCreateAccount,
	dbGetAccount,
	dbGetAccounts,
	dbUpdateAccount,
	dbUpdateActiveStatus,
} from "../db/functions/accounts";
import { Prisma } from "../../generated/prisma/client";
import { idParamsSchema } from "../schema/userSchema";

export const createAccount: RequestHandler = async (req, res) => {
	const validateRequest = createAccountSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Couldn't validate input data",
			validateRequest.error.issues,
		);
	const userId = req.user.id;
	try {
		const account = await dbCreateAccount(validateRequest.data, userId);
		res.status(201).json({ data: { account } });
	} catch (err) {
		if (
			err instanceof Prisma.PrismaClientKnownRequestError &&
			err.code === "P2002"
		) {
			console.log((err.meta as any)?.driverAdapterError?.cause?.constraint);
			throw new ConflictError("You already have an account with this name");
		}
		throw err;
	}
};
export const editAccount: RequestHandler = async (req, res) => {
	const parsedId = idParamsSchema.safeParse(req.params);
	const userId = req.user.id;
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate account id",
			parsedId.error.issues,
		);
	const id = parsedId.data.id;
	const validateRequest = editAccountSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Couldn't validate input data",
			validateRequest.error.issues,
		);
	try {
		const account = await dbUpdateAccount(validateRequest.data, userId, id);
		if (account.length === 0) throw new NotFoundError("Account not found");
		res.status(200).json({ data: { account } });
	} catch (err) {
		if (
			err instanceof Prisma.PrismaClientKnownRequestError &&
			err.code === "P2002"
		) {
			console.log((err.meta as any)?.driverAdapterError?.cause?.constraint);
			throw new ConflictError("You already have an account with this name");
		}
		throw err;
	}
};

export const getAccountsList: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const data = await dbGetAccounts(userId);
	const accounts = data.map((acc) => {
		const { transactions, _count, ...account } = acc;
		return {
			...account,
			balance: transactions[0]?.balanceAfter,
			count: _count.transactions,
		};
	});

	res.status(200).json({ data: accounts });
};
export const updateAccountActiveStatus: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate account id",
			parsedId.error.issues,
		);
	const id = parsedId.data.id;

	const validateRequest = isActiveSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Couldn't validate input data",
			validateRequest.error.issues,
		);

	const updatedAccountActiveStatus = await dbUpdateActiveStatus(
		id,
		userId,
		validateRequest.data.isActive,
	);
	if (updatedAccountActiveStatus.length === 0)
		throw new NotFoundError("Account not found");

	res.status(200).json({ data: updatedAccountActiveStatus });
};
export const getAccount: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate account id",
			parsedId.error.issues,
		);
	const id = parsedId.data.id;
	const account = await dbGetAccount(id, userId);
	if (!account) throw new NotFoundError("Account not found");

	res.status(200).json({ data: account });
};
