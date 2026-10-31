import type { RequestHandler } from "express";
import {
	parseAccountStatement,
	verifyBalances,
} from "../parser/accountStatementParser";
import { parseCardStatement } from "../parser/creditCardStatementParser";
import { accountIdSchema, creditCardIdSchema } from "../schema/uploadSchema";
import {
	ConflictError,
	NotFoundError,
	ValidationError,
} from "../../errors/errors";
import {
	dbGetAccount,
	dbUpdateAccountStatementImportDate,
} from "../db/functions/accounts";
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
	const validateRequest = accountIdSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Failed to validate input",
			validateRequest.error.issues,
		);
	const account = await dbGetAccount(validateRequest.data.accountId, userId);
	if (!account) throw new NotFoundError("Account not found");

	if (!file)
		throw new ValidationError(
			"Failed to upload file, please try again by uploading a PDF file",
		);
	const buffer = new Uint8Array(file.buffer);

	const { rows, accountNumber } = await parseAccountStatement(buffer);
	if (!accountNumber)
		throw new ValidationError(
			"Couldn't read the account number from this statement",
		);

	if (accountNumber !== account.accountNumber)
		throw new ConflictError("This statement belongs to a different account");
	const failuers = verifyBalances(rows);
	if (failuers.length > 0 || rows.length === 0)
		throw new ValidationError("The uploaded file contains broken data");

	const { created, skipped } = await dbCreateTransaction(
		rows,
		userId,
		validateRequest.data.accountId,
	);

	if (created.length > 0) {
		await dbMatchTransactionToLoan(userId);
		await dbAccountToAccountTransfers(userId);
		await dbMatchCardPayments(userId);
		await dbUpdateAccountStatementImportDate(account.id, userId);
	}

	res.status(201).json({ data: { transactions: created, skipped } });
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
	if (!card) throw new NotFoundError("Card not found");
	if (!file)
		throw new ValidationError(
			"Failed to upload file, please try again by uploading a PDF file",
		);
	const buffer = new Uint8Array(file.buffer);

	const { transactionsCount, allTransactions, cardNumber } =
		await parseCardStatement(buffer);
	if (!cardNumber)
		throw new ValidationError(
			"Couldn't read the card number from this statement",
		);
	if (cardNumber !== card.cardNumber)
		throw new ConflictError("This statement belongs to a different card");
	if (transactionsCount === 0 || allTransactions.length !== transactionsCount)
		throw new ValidationError("The uploaded file contains broken data");

	const storedTransactions = await dbCreateCardTransaction(
		userId,
		allTransactions,
		validateRequest.data.creditCardId,
	);

	res.status(201).json({ data: { transactions: storedTransactions } });
};
