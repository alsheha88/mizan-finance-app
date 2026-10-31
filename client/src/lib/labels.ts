import type { AccountType, CardType } from "@/schema/enums";

type AppliesToType = "income" | "expense"

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
	cash: "Cash",
	checking: "Checking",
	savings: "Savings",
	salary: "Salary",
};
export const CARD_TYPE_LABELS: Record<CardType, string> = {
	fullDeduction: "Full Deduction",
	installment: "Installment",
};
export const APPLIES_TO_LABELS: Record<AppliesToType, string> = {
	income: "Income",
	expense: "expense",
};

export const toOptions = <T extends string>(labels: Record<T, string>) =>
	(Object.entries(labels) as [T, string][]).map(([value, label]) => ({
		value,
		label,
	}));
