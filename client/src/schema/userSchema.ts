import z from "zod";
import { DateFormat, LanguagePreference, WeekStart } from "./enums";

const passwordField = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.max(64, "Password must be at most 64 characters");

const emailField = z.email().min(1, "Email is required");

export const createUserSchema = z
	.object({
		fullName: z.string().min(1, "This field is required"),
		password: passwordField,
		confirmPassword: z.string().min(1, "Please confirm your password"),
		email: emailField,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Password doesn't match",
		path: ["confirmPassword"],
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
		dateFormat: z.enum(DateFormat),
		currency: z.string(),
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

export type IdParams = z.infer<typeof idParamsSchema>;

export type User = {
	email: string;
	fullName: string;
	id: string;
	createdAt: Date;
	updatedAt: Date;
	isVerified: boolean;
	avatar: string | null;
	dateFormat: DateFormat;
	currency: string;
	phoneNumber: string | null;
	weekStart: WeekStart;
	language: LanguagePreference;
};
