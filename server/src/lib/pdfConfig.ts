import { RowType } from "../../generated/prisma/enums";

// ORDER IS SIGNIFICANT — first match wins.
// Match against a lowercased description.
export const rowTypeRules: { rowType: RowType; patterns: string[] }[] = [
	// Prefix-based types go first: the rest of these strings is merchant text,
	// which can contain anything (a shop called "SALARY SOLUTIONS" would
	// otherwise be classified as salary).
	{ rowType: "debit_card_purchase", patterns: ["electron settlement"] },
	{ rowType: "pos_purchase", patterns: ["pos payment"] },

	{
		rowType: "card_refund",
		patterns: ["تحويل رصيد بطاقة", "card balance refund"],
	},
	{
		rowType: "credit_card_payment",
		patterns: ["دفعة بطاقة ائتمان", "بطاقة إئتمان", "credit card pay"],
	},
	{
		rowType: "own_transfer",
		patterns: [
			"تحويل مالى",
			"fund transfer-internet",
			"transfer between own account",
		],
	},
	{ rowType: "person_transfer", patterns: ["ومض", "001o"] },
	{ rowType: "bill_payment", patterns: ["bill payment"] },
	{ rowType: "salary", patterns: ["راتب", "salary"] },
	{
		rowType: "loan_installment",
		patterns: [
			"قسط",
			"commercial installment payment",
			"pay trading inst",
			"trading installments",
		],
	},
	{ rowType: "financing", patterns: ["international tawarruq"] },
	{ rowType: "standing_order", patterns: ["أمر دفع دائم"] },
	{ rowType: "bank_fee", patterns: ["رسوم", "swift chgs"] },
	{ rowType: "incoming_wire", patterns: ["حواالت"] },
];

export const ROW_TYPE_LABELS: Record<RowType, string> = {
	debit_card_purchase: "KNET",
	pos_purchase: "POS Purchase",
	card_refund: "Card Refund",
	credit_card_payment: "Card Payment",
	own_transfer: "Account Transfer",
	person_transfer: "External Transfer",
	salary: "Salary",
	loan_installment: "Loan Payment",
	financing: "Loan Credit",
	standing_order: "Standing Order",
	bank_fee: "Bank Fees",
	incoming_wire: "Incoming Transfer",
	bill_payment: "Bills",
	unknown: "Other",
};

export const MCC_CATEGORIES: Record<string, string> = {
	// Food & drink
	"5411": "groceries", // Grocery stores / supermarkets
	"5811": "restaurants", // Caterers
	"5812": "restaurants", // Restaurants, eating places
	"5814": "restaurants", // Fast food

	// Retail
	"5311": "shopping", // Department stores
	"5691": "shopping", // Clothing stores
	"5655": "shopping", // Sports apparel
	"5941": "shopping", // Sporting goods
	"5973": "shopping", // Religious goods stores
	"5999": "shopping", // Miscellaneous specialty retail

	// Utilities & services
	"4812": "bills", // Telecom equipment
	"4814": "bills", // Telecom services

	// Health, education, leisure
	"8062": "health", // Hospitals
	"8299": "education", // Educational services
	"7999": "entertainment", // Recreation services

	// No matching category yet
	// "4829": "",  // Money transfer
	// "5511": "",  // Car dealers
	// "6051": "",  // Quasi-cash / financial institutions
	// "7230": "",  // Beauty & barber shops
	// "7523": "",  // Parking lots & garages
	// "9399": "",  // Government services
};

export const NON_MCC_CATEGORIES_MAP: Partial<Record<RowType, string>> = {
	bank_fee: "fees",
	bill_payment: "bills",
	card_refund: "refunds",
	loan_installment: "loan payment",
	financing: "loan received",
	incoming_wire: "other income",
	salary: "salary",
};
