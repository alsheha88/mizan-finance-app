import z from "zod";
import { TransactionType } from "../../generated/prisma/enums";

export const createCategorySchema = z.object({
	name: z.string().min(1, "This field is required"),
	color: z
		.string()
		.regex(/^#?([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, {
			message: "Invalid CSS Hex Color code",
		}),
	appliesTo: z.enum(TransactionType),
});
export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategory = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
