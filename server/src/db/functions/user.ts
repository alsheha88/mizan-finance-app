import type { Prisma } from "../../../generated/prisma/client";
import { hashPassword } from "../../lib/authHelpers";
import { prisma } from "../../lib/prisma";
import type { CreateUser, UpdateUser } from "../../schema/userSchema";

export const dbCreateUser = async (
	user: CreateUser,
	client: Prisma.TransactionClient = prisma,
) => {
	const email = user.email.toLowerCase();
	const passwordHash = await hashPassword(user.password);
	return await client.user.create({
		data: { fullName: user.fullName, email: email, passwordHash: passwordHash },
		omit: { passwordHash: true },
	});
};

export const dbEditUser = async (user: UpdateUser, id: string) => {
	const data = Object.fromEntries(
		Object.entries(user).filter(([, v]) => v !== undefined),
	);
	return await prisma.user.update({
		where: { id },
		data,
		omit: { passwordHash: true },
	});
};

export const dbDeleteUser = async (id: string) => {
	return await prisma.user.deleteMany({
		where: { id },
	});
};

export const dbGetUserByEmail = async (input: string) => {
	const email = input.toLowerCase();
	return await prisma.user.findUnique({ where: { email } });
};
export const dbGetUserById = async (id: string) => {
	return await prisma.user.findUnique({
		where: { id },
		omit: { passwordHash: true },
	});
};

export const dbVerifyUser = async (id: string) => {
	return await prisma.user.update({
		where: { id },
		data: { isVerified: true },
	});
};

export const createRefreshToken = async (
	tokenHash: string,
	userId: string,
	client: Prisma.TransactionClient = prisma,
) => {
	return await client.refreshToken.create({
		data: {
			tokenHash: tokenHash,
			userId: userId,
			expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		},
	});
};

export const markRefreshToken = async (
	tokenHash: string,
	client: Prisma.TransactionClient = prisma,
) => {
	return await client.refreshToken.updateMany({
		where: { tokenHash, usedAt: null },
		data: { usedAt: new Date() },
	});
};
export const dbGetRefreshToken = async (tokenHash: string) => {
	return await prisma.refreshToken.findFirst({ where: { tokenHash } });
};

export const invalidateAllUserRefreshTokens = async (userId: string) => {
	return await prisma.refreshToken.updateMany({
		where: { userId, usedAt: null },
		data: { usedAt: new Date() },
	});
};
