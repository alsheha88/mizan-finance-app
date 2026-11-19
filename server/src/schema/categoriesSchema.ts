import z from "zod";
import { PaletteColor, TransactionType } from "../../generated/prisma/enums";

// One rule for the name, shared by create and edit, so "   " or a 500-character
// name can't get in through either.
const categoryName = z.string().trim().min(1, "This field is required").max(50);

export const createCategorySchema = z.object({
	name: categoryName,
	appliesTo: z.enum(TransactionType),
});
export const updateCategorySchema = z
	.object({
		name: categoryName,
		color: z.enum(PaletteColor),
	})
	.partial();

export type CreateCategory = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
