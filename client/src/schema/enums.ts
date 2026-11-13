export const LanguagePreference = {
	en: "en",
	ar: "ar",
} as const;

export type LanguagePreference =
	(typeof LanguagePreference)[keyof typeof LanguagePreference];

export const WeekStart = {
	sun: "sun",
	mon: "mon",
} as const;

export type WeekStart = (typeof WeekStart)[keyof typeof WeekStart];

export const DateFormat = {
	dd_MM_yyyy: "dd_MM_yyyy",
	MM_dd_yyyy: "MM_dd_yyyy",
	yyyy_MM_dd: "yyyy_MM_dd",
} as const;

export type DateFormat = (typeof DateFormat)[keyof typeof DateFormat];

export const AccountType = {
	cash: "cash",
	checking: "checking",
	savings: "savings",
	salary: "salary",
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const TransactionType = {
	income: "income",
	expense: "expense",
	transfer: "transfer",
} as const;

export type TransactionType =
	(typeof TransactionType)[keyof typeof TransactionType];

export const RowType = {
	debit_card_purchase: "debit_card_purchase",
	pos_purchase: "pos_purchase",
	credit_card_payment: "credit_card_payment",
	own_transfer: "own_transfer",
	person_transfer: "person_transfer",
	salary: "salary",
	loan_installment: "loan_installment",
	standing_order: "standing_order",
	bill_payment: "bill_payment",
	bank_fee: "bank_fee",
	incoming_wire: "incoming_wire",
	card_refund: "card_refund",
	financing: "financing",
	unknown: "unknown",
} as const;

export type RowType = (typeof RowType)[keyof typeof RowType];

export const PaletteColor = {
	mint: "mint",
	cyan: "cyan",
	sky: "sky",
	indigo: "indigo",
	violet: "violet",
	pink: "pink",
	rose: "rose",
	orange: "orange",
	coral: "coral",
	amber: "amber",
	yellow: "yellow",
	mauve: "mauve",
} as const;

export type PaletteColor = (typeof PaletteColor)[keyof typeof PaletteColor];

export const CardType = {
	installment: "installment",
	fullDeduction: "fullDeduction",
} as const;

export type CardType = (typeof CardType)[keyof typeof CardType];

export const CardTransactionType = {
	payment: "payment",
	purchase: "purchase",
} as const;

export type CardTransactionType =
	(typeof CardTransactionType)[keyof typeof CardTransactionType];

export const InvestmentCategory = {
	stocks: "stocks",
	ETF: "ETF",
	crypto: "crypto",
	funds: "funds",
	commodity: "commodity",
	other: "other",
} as const;

export type InvestmentCategory =
	(typeof InvestmentCategory)[keyof typeof InvestmentCategory];

export const MessageRole = {
	user: "user",
	assistant: "assistant",
} as const;
export type MessageRole = (typeof MessageRole)[keyof typeof MessageRole]

