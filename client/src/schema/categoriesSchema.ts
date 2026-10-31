import z from "zod";
import { PaletteColor, TransactionType } from "./enums";

export const createCategorySchema = z.object({
	name: z.string().min(1, "This field is required"),
	appliesTo: z.enum(TransactionType),
});
export const updateCategorySchema = z
	.object({
		name: z.string().trim().min(1, "This field is required").max(50),
		color: z.enum(PaletteColor),
	})
	.partial();

export type CreateCategoryData = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;

export type Category = {
	id: string;
	name: string;
	color: PaletteColor;
	appliesTo: TransactionType;
	userId: string;
};
