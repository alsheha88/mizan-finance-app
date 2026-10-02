import { type TransactionType } from "../../../generated/prisma/enums";
import { formatDate, stripCommas } from "../../lib/helpers";
import { prisma } from "../../lib/prisma";
import { type StatementRow } from "../../parser/statement-parser";

export type Transaction = {
	transactionDate: Date;
	amount: string;
	balanceAfter: string;
	merchant: string;
	transferGroupId?: string | null;
	categoryId?: string | null;
	description: string;
	userId: string;
	accountId: string;
	type: TransactionType;
	statementRow: number;
};

export const dbCreateTransaction = async (
	data: StatementRow[],
	userId: string,
	accountId: string,
) => {
	const transactions: Transaction[] = data.map((i, index) => {
		return {
			transactionDate: formatDate(i.date),
			amount: Number(stripCommas(i.credit))
				? stripCommas(i.credit)
				: stripCommas(i.debit),
			balanceAfter: stripCommas(i.balance),
			merchant: i.description,
			description: i.description,
			userId,
			accountId,
			type: Number(stripCommas(i.credit))
				? "income"
				: ("expense" as TransactionType),
			statementRow: index,
		};
	});

	return await prisma.transaction.createManyAndReturn({ data: transactions });
};
