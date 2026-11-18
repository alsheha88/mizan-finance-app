import {
	dbGetSalaryCycleTotals,
	dbGetSalaryRows,
} from "../db/functions/transactions";
import { roundValues } from "./helpers";

export const calculateSalaryHealth = async (userId: string, count: number) => {
	const salaryRows = await dbGetSalaryRows(userId, count);
	if (salaryRows.length === 0)
		return {
			cycles: [],
			averages: null,
			message: "No salary transactions found",
		};
	const cycles = await Promise.all(
		salaryRows.map(async (row, index, list) => {
			const end = list[index - 1] ?? null;
			const totals = await dbGetSalaryCycleTotals(userId, row, end);
			const salary = row.amount;
			const totalSpending = totals.bankSpending + totals.cardSpending;
			const net =
				salary + totals.otherIncome - totals.loanInstallments - totalSpending;
			const savingRatePercent = (net / salary) * 100;
			const installmentsPercent = (totals.loanInstallments / salary) * 100;
			const isComplete = end !== null;

			return {
				otherIncome: roundValues(totals.otherIncome),
				loanInstallments: roundValues(totals.loanInstallments),
				bankSpending: roundValues(totals.bankSpending),
				cardSpending: roundValues(totals.cardSpending),
                loansReceived: roundValues(totals.loansReceived),
                loanPayoffs: roundValues(totals.loanPayoffs),
				salary: roundValues(salary),
				totalSpending: roundValues(totalSpending),
				net: roundValues(net),
				savingRatePercent: roundValues(savingRatePercent, 1),
				installmentsPercent: roundValues(installmentsPercent, 1),
				isComplete,
				start: row.transactionDate.toISOString().slice(0, 10),
				end: end?.transactionDate.toISOString().slice(0, 10) ?? null,
			};
		}),
	);
	const completeCycles = cycles.filter((cycle) => cycle.isComplete);
	const sums =
		completeCycles.length === 0
			? null
			: completeCycles.reduce(
					(acc, cycle) => {
						return {
							salary: acc.salary + cycle.salary,
							totalSpending: acc.totalSpending + cycle.totalSpending,
							net: acc.net + cycle.net,
							savingRatePercent:
								acc.savingRatePercent + cycle.savingRatePercent,
							installmentsPercent:
								acc.installmentsPercent + cycle.installmentsPercent,
						};
					},
					{
						salary: 0,
						totalSpending: 0,
						net: 0,
						savingRatePercent: 0,
						installmentsPercent: 0,
					},
				);
	const n = completeCycles.length;
	const averages = sums
		? {
				salary: roundValues(sums.salary / n),
				totalSpending: roundValues(sums.totalSpending / n),
				net: roundValues(sums.net / n),
				savingRatePercent: roundValues(sums.savingRatePercent / n, 1),
				installmentsPercent: roundValues(sums.installmentsPercent / n, 1),
				cycleCount: n,
			}
		: null;

	return { cycles, averages };
};
