import type Anthropic from "@anthropic-ai/sdk";
import { toJSONSchema } from "zod";
import { debtStatusInput } from "../../schema/toolsSchema.js";
import { dbGetLoan, dbGetLoans } from "../../db/functions/loans";
import { dbGetDebtStats } from "../../db/functions/dashboard.js";

export const debtStatusToolDefinition = {
	name: "getDebtStatus",
	description:
		"Returns the status of the user's loans, in KD. With a loan name, returns that loan only. Without a name, returns the total original amount and total remaining across all loans, plus the names of the user’s loans. To get the details of one loan, call the tool again with its name. For each loan it returns: the original amount, the amount paid so far, the remaining amount, the monthly installment, the number of installments left, and the last installment date, which is the date of the final scheduled installment when the loan ends. Use this tool when the user asks how much is left on a loan, when a loan will finish, or about their loans and debts in general. All calculations are already done: report the numbers exactly as returned. If the loan name is not found, the result lists the user's real loan names; pick the correct one and call the tool again.",
	input_schema: toJSONSchema(debtStatusInput) as Anthropic.Tool.InputSchema,
} satisfies Anthropic.Tool;

export async function getDebtStatus(input: unknown, userId: string) {
	// 1. Check the model's input before touching the database
	const validateRequest = debtStatusInput.safeParse(input);
	if (!validateRequest.success) {
		return {
			error: "failed to validate input data",
			details: validateRequest.error.message,
		};
	}

	const loans = await dbGetLoans(userId);
	const loanNames = loans.map((loan) => loan.name);
	const requestedName = validateRequest.data.name;

	// 2. No name: totals across all loans, plus the loan names
	if (!requestedName) {
		const stats = await dbGetDebtStats(userId);
		return {
			totalOriginal: Number(stats.originalAmount.toFixed(3)),
			totalOutstanding: Number(stats.outstandingLoan.toFixed(3)),
			loanNames,
		};
	}

	// 3. A name: find the loan loosely (case-insensitive, part of the name is enough)
	const searchName = requestedName.toLowerCase();
	const existingLoan = loans.find((loan) =>
		loan.name.toLowerCase().includes(searchName),
	);
	if (!existingLoan) {
		return {
			error: `Loan "${requestedName}" not found`,
			availableLoans: loanNames,
		};
	}

	const data = await dbGetLoan(existingLoan.id, userId);
	if (!data) {
		return {
			error: `Loan "${requestedName}" not found`,
			availableLoans: loanNames,
		};
	}

	// 4. Calculate in code, with exact Decimal math, then convert for the model
	const paid = data.originalAmount.minus(data.outstanding);
	const installmentsLeft = data.installment.isZero()
		? null
		: Math.ceil(data.outstanding.dividedBy(data.installment).toNumber());

	return {
		name: data.name,
		originalAmount: Number(data.originalAmount.toFixed(3)),
		paid: Number(paid.toFixed(3)),
		remaining: Number(data.outstanding.toFixed(3)),
		monthlyInstallment: Number(data.installment.toFixed(3)),
		installmentsLeft,
		startDate: data.startDate.toISOString().slice(0, 10),
		lastInstallmentDate: data.lastInstallmentDate.toISOString().slice(0, 10),
	};
}
