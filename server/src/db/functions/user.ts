import type { Prisma } from "../../../generated/prisma/client";
import { hashPassword } from "../../lib/authHelpers";
import { defaultCategories } from "../../lib/defaultCategories";
import { prisma } from "../../lib/prisma";
import type { CreateUser, UpdateUser } from "../../schema/userSchema";

export const dbCreateUser = async (user: CreateUser) => {
	const email = user.email.toLowerCase();
	const passwordHash = await hashPassword(user.password);
	const createdUser = await prisma.$transaction(async (tx) => {
		const newUser = await tx.user.create({
			data: {
				fullName: user.fullName,
				email,
				passwordHash,
			},
			omit: { passwordHash: true },
		});
		await tx.category.createMany({
			data: defaultCategories.map((c) => ({ ...c, userId: newUser.id })),
		});

		return newUser;
	});
	return createdUser;
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
	return await prisma.user.delete({
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
