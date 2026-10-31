import type {
	PaletteColor,
	TransactionType,
} from "../../generated/prisma/enums";

export type DefaultCategoriesType = {
	name: string;
	appliesTo: TransactionType;
	color: PaletteColor;
}[];

export const defaultCategories = [
	{ name: "groceries", appliesTo: "expense", color: "mauve" },
	{ name: "restaurants", appliesTo: "expense", color: "pink" },
	{ name: "fuel", appliesTo: "expense", color: "yellow" },
	{ name: "shopping", appliesTo: "expense", color: "violet" },
	{ name: "health", appliesTo: "expense", color: "rose" },
	{ name: "coffee", appliesTo: "expense", color: "orange" },
	{ name: "rent", appliesTo: "expense", color: "indigo" },
	{ name: "education", appliesTo: "expense", color: "cyan" },
	{ name: "entertainment", appliesTo: "expense", color: "amber" },
	{ name: "bills", appliesTo: "expense", color: "coral" },
	{ name: "loan payment", appliesTo: "expense", color: "mint" },
	{ name: "fees", appliesTo: "expense", color: "sky" },
	{ name: "transfers out", appliesTo: "expense", color: "indigo" },
	{ name: "parking", appliesTo: "expense", color: "sky" },
	{ name: "installments", appliesTo: "expense", color: "violet" },
	{ name: "other income", appliesTo: "income", color: "sky" },
	{ name: "salary", appliesTo: "income", color: "mint" },
	{ name: "loan received", appliesTo: "income", color: "cyan" },
	{ name: "refunds", appliesTo: "income", color: "mauve" },
] as const satisfies DefaultCategoriesType;

export type CategoryName = (typeof defaultCategories)[number]["name"];
