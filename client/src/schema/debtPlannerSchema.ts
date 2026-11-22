import z from "zod";

type CardRule = {
	type: "percent";
	rate: number;
};

type LoanRule = {
	type: "fixed";
	installment: number;
};
export type Debt = {
	id: string;
	name: string;
	balance: number;
	rule: CardRule | LoanRule;
};

export const debtPlannerQuerySchema = z.object({
	extra: z.coerce.number().multipleOf(0.001).min(0).max(1_000_000).default(0),
});

export type DebtPlanResponse = {
	withPlan: {
		totals: number[];
		month: number;
		payoffMonths: Record<string, number>;
		monthlyBudget: number;
	};
	withoutPlan: {
		totals: number[];
		month: number;
		payoffMonths: Record<string, number>;
	};
	monthsSaved: number;
	order: {
		balance: number;
		id: string;
		name: string;
		payoffMonth: number | null;
		kind: "card" | "loan";
	}[];
};
export type DebtPlannerQuery = z.infer<typeof debtPlannerQuerySchema>;
