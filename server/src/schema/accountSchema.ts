import z from "zod";
import { AccountType } from "../../generated/prisma/enums";

export const createAccountSchema = z.object({
	name: z.string().min(1, "This field is required"),
	accountType: z.enum(AccountType),
	accountNumber: z
		.string()
		.length(4)
		.regex(/^\d{4}$/),
	isPrimary: z.boolean().default(false),
});

export const isActiveSchema = z.object({
	isActive: z.boolean(),
});

export const editAccountSchema = createAccountSchema.partial();

export type CreateAccountData = z.infer<typeof createAccountSchema>;
export type EditAccountData = z.infer<typeof editAccountSchema>;
