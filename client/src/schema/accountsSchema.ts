import z from "zod";
import { AccountType } from "./enums";

export const createAccountSchema = z.object({
	name: z.string().min(1, "This field is required"),
	accountType: z.enum(AccountType),
	accountNumber: z
		.string()
		.regex(/^\d{12}$/, "Account number must be 12 digits"),
});

export const isActiveSchema = z.object({
	isActive: z.boolean(),
});

export const editAccountSchema = createAccountSchema.partial();

export type CreateAccountData = z.infer<typeof createAccountSchema>;
export type EditAccountData = z.infer<typeof editAccountSchema>;
export type ActiveAccountData = z.infer<typeof isActiveSchema>;

export type Account = {
	id: string;
	name: string;
	accountNumber: string;
	accountType: AccountType;
	isPrimary: boolean;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	userId: string;
	lastImportedAt: string | null
};

export type AccountListItem = Account & {
	balance: string | undefined;
	count: number;
};

