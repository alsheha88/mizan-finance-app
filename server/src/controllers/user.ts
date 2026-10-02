import type { RequestHandler } from "express";
import { createUserSchema, loginSchema } from "../schema/userSchema";
import {
	ConflictError,
	NotFoundError,
	UnauthorizedError,
	ValidationError,
} from "../../errors/errors";
import {
	createRefreshToken,
	dbCreateUser,
	dbGetRefreshToken,
	dbGetUserByEmail,
    invalidateAllUserRefreshTokens,
    markRefreshToken,
} from "../db/functions/user";
import {
	checkPassword,
	generateRawToken,
	generateToken,
	hashPassword,
	hashToken,
	verifyToken,
} from "../lib/authHelpers";
import { prisma } from "../lib/prisma";

export const signup: RequestHandler = async (req, res) => {
	const validateRequest = createUserSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Couldn't validate user data",
			validateRequest.error.issues,
		);
	const email = validateRequest.data.email;
	const password = validateRequest.data.password;
	const fullName = validateRequest.data.fullName;
	const existingUser = await dbGetUserByEmail(email);
	if (existingUser)
		throw new ConflictError("User already exists, please try to login");
	const user = {
		fullName,
		password,
		email,
	};

	const newUser = await dbCreateUser(user);

	res.status(201).json({ data: { newUser } });
};
export const login: RequestHandler = async (req, res) => {
	const validateRequest = loginSchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Couldn't validate user data",
			validateRequest.error.issues,
		);
	const email = validateRequest.data.email;
	const user = await dbGetUserByEmail(email);
	if (!user)
		throw new NotFoundError(
			"User with this email is not found, please sign up for a new account",
		);

	const password = validateRequest.data.password;
	const isPasswordCorrect = await checkPassword(password, user.passwordHash);
	if (!isPasswordCorrect)
		throw new UnauthorizedError("Wrong email or password");

	const rawToken = generateRawToken();
	const tokenHash = hashToken(rawToken);
	const accessToken = generateToken({ userId: user.id });

	await createRefreshToken(tokenHash, user.id);

	res.cookie("refreshToken", rawToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
		maxAge: 1000 * 60 * 60 * 24 * 30,
	});

	res.status(200).json({ data: { accessToken } });
};

export const refresh: RequestHandler = async (req, res) => {
	const cookie = req.cookies.refreshToken;
	if (!cookie) throw new UnauthorizedError("No token provided");

    const hashedCookie = hashToken(cookie);
    const existingToken = await dbGetRefreshToken(hashedCookie);
    if (!existingToken) throw new UnauthorizedError("Invalid token");
    const userId = existingToken.userId;

    if (existingToken.usedAt){
        await invalidateAllUserRefreshTokens(userId);
		throw new UnauthorizedError("Token reuse detected. Please log in again.");
    }
    if (existingToken.expiresAt < new Date())
		throw new UnauthorizedError("token is expired");
    const rawToken = generateRawToken();
	const newHash = hashToken(rawToken);
	await prisma.$transaction(async (tx) => {
		await markRefreshToken(existingToken.tokenHash, tx);
		await createRefreshToken(newHash, userId, tx);
	});
	const accessToken = generateToken({ userId });

	res.cookie("refreshToken", rawToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
		maxAge: 1000 * 60 * 60 * 24 * 30,
	});

	res.status(200).json({ data: { accessToken } });
};

export const logout: RequestHandler = async (req, res) => {
	const refreshToken = req.cookies.refreshToken;

	if (refreshToken) {
		const tokenHash = hashToken(refreshToken);
		await markRefreshToken(tokenHash);
	}
	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
	});

	res.status(200).json({ data: { message: "Logged out successfully" } });
};
