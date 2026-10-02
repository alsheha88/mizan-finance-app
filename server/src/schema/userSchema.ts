import z from "zod";
import { LanguagePreference, WeekStart } from "../../generated/prisma/enums";

const passwordField = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.max(64, "Password must be at most 64 characters");

const emailField = z.email().min(1, "Email is required");

export const createUserSchema = z.object({
	fullName: z.string().min(1, "This field is required"),
	password: passwordField,
	email: emailField,
});
export const loginSchema = z.object({
	password: passwordField,
	email: emailField,
});

export const editUserSchema = z
	.object({
		fullName: z.string(),
		avatar: z.url(),
		phoneNumber: z.string(),
        weekStart: z.enum(WeekStart),
        language: z.enum(LanguagePreference),
        dateFormat: z.string(),
        currency: z.string()
	})
	.partial();

export const idParamsSchema = z.object({
	id: z.uuid(),
});

export type UpdateUser = z.infer<typeof editUserSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
export const verifyEmailSchema = z.object({
	token: z.string().min(1),
});
