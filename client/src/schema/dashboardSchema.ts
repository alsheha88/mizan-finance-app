import type { PaletteColor } from "./enums";
import type { TransactionListItem } from "./transactionsSchema";

export type DashboardResponse = {
	income: string;
	expenses: string;
	netCash: string;
	cashflow: {
		year: number;
		monthIndex: number;
		income: number;
		expense: number;
	}[];
	spendingByCategory: {
		categoryId: string | null;
		name: string;
		color: PaletteColor | null;
		total: number;
	}[];
	debtStats: {
		originalAmount: string;
		outstandingLoan: string;
		balance: string;
		limit: string;
	};
	recentTransactions: TransactionListItem[];
	month: string;
};
