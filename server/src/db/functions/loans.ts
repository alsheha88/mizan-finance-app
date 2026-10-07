import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type { CreateLoanData, EditLoanData } from "../../schema/loansSchema";

export const dbGetLoans = async (userId: string) => {
	const loans = await prisma.loan.findMany({
		where: { userId },
		include: { transactions: { select: { amount: true } } },
	});

	const outstandingLoan = loans.map((i) => {
		const { transactions, ...loan } = i;
		const total = transactions.reduce(
			(sum, t) => sum.plus(t.amount),
			new Prisma.Decimal(0),
		);
		const outstanding = loan.originalAmount.minus(total);

		return { ...loan, outstanding };
	});

	return outstandingLoan;
};
export const dbGetLoan = async (id: string, userId: string) => {
	const loan = await prisma.loan.findFirst({
		where: { id, userId },
		include: { transactions: { select: { amount: true } } },
	});

	if (!loan) return null;
	const { transactions, ...rest } = loan;
	const total = transactions.reduce(
		(sum, t) => sum.plus(t.amount),
		new Prisma.Decimal(0),
	);
	return { ...rest, outstanding: rest.originalAmount.minus(total) };
};
export const dbGetLoanByInvoiceNumber = async (
	invoiceNumber: string,
	userId: string,
) => {
	return await prisma.loan.findFirst({ where: { userId, invoiceNumber } });
};

export const dbCreateLoan = async (userId: string, data: CreateLoanData) => {
	return await prisma.loan.create({
		data: {
			...data,
			userId,
		},
	});
};
export const dbUpdateLoan = async (
	id: string,
	userId: string,
	loan: EditLoanData,
) => {
	const data = Object.fromEntries(
		Object.entries(loan).filter(([, v]) => v !== undefined),
	);
	return await prisma.loan.updateManyAndReturn({
		where: { id, userId },
		data,
	});
};

export const dbDeleteLoan = async (id: string, userId: string) => {
	return await prisma.loan.deleteMany({ where: { id, userId } });
};
