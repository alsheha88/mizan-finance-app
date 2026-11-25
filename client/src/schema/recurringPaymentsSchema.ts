import z from "zod";

export type PaymentSource = "bank" | "card";

export type RecurringPaymentStatus =
	| "inactive"
	| "paid"
	| "due"
	| "waiting"
	| "missing";

// One recurring payment as GET /api/recurring-payments returns it.
// Money is in KWD; dates arrive as ISO strings.
export type RecurringPayment = {
	id: string;
	name: string;
	expectedAmount: number;
	expectedDay: number;
	amountVaries: boolean;
	isActive: boolean;
	categoryId: string | null;
	dueDate: string;
	status: RecurringPaymentStatus;
	paidOn: string | null;
	paidAmount: number | null;
	priceChange: number | null;
};

export type RecurringPaymentsResponse = {
	cycle: { start: string; end: string };
	payments: RecurringPayment[];
	total: number;
};

const name = z
	.string()
	.trim()
	.min(1, "This field is required")
	.max(60, "Keep the name under 60 characters");
const expectedAmount = z
	.number({ error: "Enter the expected amount" })
	.positive("The amount must be more than 0")
	.multipleOf(0.001)
	.max(1_000_000);
const expectedDay = z
	.number({ error: "Enter the day of the month" })
	.int()
	.min(1, "Day must be between 1 and 31")
	.max(31, "Day must be between 1 and 31");

// "Add as recurring": the form values plus the transaction it starts from.
export const createRecurringPaymentSchema = z.object({
	name,
	expectedAmount,
	expectedDay,
	amountVaries: z.boolean().optional(),
	categoryId: z.uuid().optional(),
	transactionId: z.uuid(),
	source: z.enum(["bank", "card"]),
});

// Editing: every field optional and no defaults, so a field that isn't sent
// stays as it is. categoryId accepts null to remove the category.
export const updateRecurringPaymentSchema = z
	.object({
		name,
		expectedAmount,
		expectedDay,
		amountVaries: z.boolean(),
		isActive: z.boolean(),
		categoryId: z.uuid().nullable(),
	})
	.partial();

export const transactionLinkSchema = z.object({
	transactionId: z.uuid(),
	source: z.enum(["bank", "card"]),
});

export type CreateRecurringPaymentData = z.infer<
	typeof createRecurringPaymentSchema
>;
export type UpdateRecurringPaymentData = z.infer<
	typeof updateRecurringPaymentSchema
>;
export type TransactionLinkData = z.infer<typeof transactionLinkSchema>;
