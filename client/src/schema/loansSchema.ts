import z from "zod";


const loanFields = z.object({
	name: z.string().trim().min(1, "Enter a loan name").max(50),
	invoiceNumber: z.string().regex(/^\d+$/, "Invoice number must be digits only"),
	installment: z
		.number({ error: "Enter the monthly installment" })
		.positive("Must be more than 0")
		.multipleOf(0.001)
		.max(1_000_000),
	originalAmount: z
		.number({ error: "Enter the loan amount" })
		.positive("Must be more than 0")
		.multipleOf(0.001)
		.max(1_000_000),
	startDate: z.date(),
	lastInstallmentDate: z.date(),
});

const endNotBeforeStart = {
	message: "Must be on or after the start date",
	path: ["lastInstallmentDate"],
};

export const createLoanSchema = loanFields.refine(
	(data) => data.lastInstallmentDate >= data.startDate,
	endNotBeforeStart,
);

export const editLoanSchema = loanFields
	.omit({ invoiceNumber: true })
	.partial()
	.refine(
		(data) =>
			!data.startDate ||
			!data.lastInstallmentDate ||
			data.lastInstallmentDate >= data.startDate,
		endNotBeforeStart,
	);

export type CreateLoanData = z.infer<typeof createLoanSchema>;
export type EditLoanData = z.infer<typeof editLoanSchema>;

export type Loan = {
	id: string;
	name: string;
	invoiceNumber: string;
	installment: string;
	originalAmount: string;
	startDate: string;
	lastInstallmentDate: string;
	createdAt: string;
	updatedAt: string;
	userId: string;
};

export type LoanWithOutstanding = Loan & {
	outstanding: string;
};