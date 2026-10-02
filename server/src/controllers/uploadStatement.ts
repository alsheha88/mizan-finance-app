import type { RequestHandler } from "express";
import { parseStatement, verifyBalances } from "../parser/statement-parser";
import { accountIdSchema } from "../schema/uploadSchema";
import { ValidationError } from "../../errors/errors";
import { dbGetAccount } from "../db/functions/accounts";
import { dbCreateTransaction } from "../db/functions/transactions";

export const uploadStatement: RequestHandler = async (req, res) => {
	const file = req.file;
	const userId = req.user.id; //Temporary;
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
	try {
		const transactions = await parseStatement(buffer);
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

		res.status(200).json({ data: storedTransactions });
	} catch (err) {
		res.status(400).json({ data: { message: "Something went wrong" } });
	}
};
