import type { Debt } from "../../lib/debtPlanner";
import { prisma } from "../../lib/prisma";
import { dbGetLoans } from "./loans";

export const dbGetPlannerDebts = async (userId: string) => {
	const cards = await prisma.creditCard.findMany({
		where: { userId, type: "installment", outstandingBalance: { gt: 0 } },
	});
	const loans = (await dbGetLoans(userId)).filter((i) => i.outstanding.gt(0));

	const cardsDebt: Debt[] = cards.map((i) => {
		return {
			id: i.id,
			name: i.name,
			balance: i.outstandingBalance.times(1000).toNumber(),
			rule: {
				type: "percent",
				rate: i.installmentPercentage?.toNumber() ?? 8.33,
			},
		};
	});
	const loansDebt: Debt[] = loans.map((i) => {
		return {
			id: i.id,
			name: i.name,
			balance: i.outstanding.times(1000).toNumber(),
			rule: {
				type: "fixed",
				installment: i.installment.times(1000).toNumber(),
			},
		};
	});

	const debts = [...cardsDebt, ...loansDebt];

	return debts;
};
