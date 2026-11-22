import z from "zod";

export const debtPlannerQuerySchema = z.object({
	extra: z.coerce.number().multipleOf(0.001).min(0).max(1_000_000).default(0),
});

export type DebtPlannerQuery = z.infer<typeof debtPlannerQuerySchema>;
