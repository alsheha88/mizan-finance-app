import z from "zod";

export const createLoanSchema = z.object({
	name: z.string().min(1, "This field is required").max(50),
	invoiceNumber: z.string().regex(/^\d+$/),
	installment: z.number().positive().multipleOf(0.001).max(1_000_000),
	startDate: z.coerce.date(),
	lastInstallmentDate: z.coerce.date(),
	originalAmount: z.number().positive().multipleOf(0.001).max(1_000_000),
});

export const editLoanSchema = createLoanSchema
	.omit({ invoiceNumber: true })
	.partial();
export type CreateLoanData = z.infer<typeof createLoanSchema>;
export type EditLoanData = z.infer<typeof editLoanSchema>;
