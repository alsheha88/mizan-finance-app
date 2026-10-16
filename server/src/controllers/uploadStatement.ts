import type { RequestHandler } from "express";
import {
	parseAccountStatement,
	verifyBalances,
} from "../parser/accountStatementParser";
import { parseCardStatement } from "../parser/creditCardStatementParser";
import { accountIdSchema, creditCardIdSchema } from "../schema/uploadSchema";
import { ValidationError } from "../../errors/errors";
import { dbGetAccount } from "../db/functions/accounts";
import {
	dbAccountToAccountTransfers,
	dbMatchCardPayments,
	dbCreateTransaction,
	dbMatchTransactionToLoan,
} from "../db/functions/transactions";
import {
	dbCreateCardTransaction,
	dbGetCreditCard,
} from "../db/functions/creditCards";

export const uploadAccountStatement: RequestHandler = async (req, res) => {
	const file = req.file;
	const userId = req.user.id;
	console.log("UPLOAD HANDLER v2");
	const validateRequest = accountIdSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Failed to validate input",
			validateRequest.error.issues,
		);
	const account = await dbGetAccount(validateRequest.data.accountId, userId);
	if (!account)
		return res.status(404).json({ data: { message: "Account not found" } });
	if (!file)
		return res.status(400).json({
			data: {
				message:
					"Failed to upload file, please try again by uploading a PDF file",
			},
		});
	const buffer = new Uint8Array(file.buffer);

	const transactions = await parseAccountStatement(buffer);
	const failuers = verifyBalances(transactions);
	if (failuers.length > 0 || transactions.length === 0) {
		return res
			.status(400)
			.json({ data: { message: "The uploaded file contain broken data" } });
	}

	const storedTransactions = await dbCreateTransaction(
		transactions,
		userId,
		validateRequest.data.accountId,
	);

	console.log("transfers:", await dbAccountToAccountTransfers(userId));
	console.log("cards:", await dbMatchCardPayments(userId));

	await dbMatchTransactionToLoan(userId);
	await dbAccountToAccountTransfers(userId);
	await dbMatchCardPayments(userId);

	res.status(201).json({ data: storedTransactions });
};
export const uploadCardStatement: RequestHandler = async (req, res) => {
	const file = req.file;
	const userId = req.user.id;
	const validateRequest = creditCardIdSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Failed to validate input",
			validateRequest.error.issues,
		);
	const card = await dbGetCreditCard(userId, validateRequest.data.creditCardId);
	if (!card)
		return res.status(404).json({ data: { message: "Card not found" } });
	if (!file)
		return res.status(400).json({
			data: {
				message:
					"Failed to upload file, please try again by uploading a PDF file",
			},
		});
	const buffer = new Uint8Array(file.buffer);

	const transactions = await parseCardStatement(buffer);
	if (
		transactions.transactionsCount === 0 ||
		transactions.allTransactions.length !== transactions.transactionsCount
	) {
		return res
			.status(400)
			.json({ data: { message: "The uploaded file contain broken data" } });
	}

	const storedTransactions = await dbCreateCardTransaction(
		userId,
		transactions.allTransactions,
		validateRequest.data.creditCardId,
	);

	res.status(201).json({ data: storedTransactions });
};
