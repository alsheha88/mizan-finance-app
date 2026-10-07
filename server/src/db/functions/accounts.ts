import { AccountType } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type {
	CreateAccountData,
	EditAccountData,
} from "../../schema/accountsSchema";

export const dbGetAccount = async (id: string, userId: string) => {
	return await prisma.account.findFirst({ where: { id, userId } });
};
// export const dbGetAccountByName = async (name: string, userId: string) => {
// 	return await prisma.account.findUnique({ where: { name, userId } });
// };

export const dbGetAccounts = async (userId: string) => {
	const accounts = await prisma.account.findMany({
		where: { userId },
		include: {
			transactions: {
				orderBy: [{ transactionDate: "desc" }, { statementRow: "desc" }],
				take: 1,
				select: { balanceAfter: true },
			},
			_count: true,
		},
	});

	return accounts;
};
export const dbCreateAccount = async (
	account: CreateAccountData,
	userId: string,
) => {
	return await prisma.$transaction(async (tx) => {
		if (account.isPrimary) {
			await tx.account.updateMany({
				where: { userId },
				data: {
					isPrimary: false,
				},
			});
		}
		return await tx.account.create({
			data: {
				name: account.name,
				accountNumber: account.accountNumber,
				accountType: account.accountType,
				isPrimary: account.isPrimary,
				userId,
			},
		});
	});
};
export const dbUpdateAccount = async (
	account: EditAccountData,
	userId: string,
	id: string,
) => {
	const data = Object.fromEntries(
		Object.entries(account).filter(([, v]) => v !== undefined),
	);
	return await prisma.$transaction(async (tx) => {
		if (account.isPrimary) {
			await tx.account.updateManyAndReturn({
				where: { userId },
				data: {
					isPrimary: false,
				},
			});
		}
		return await tx.account.updateManyAndReturn({
			where: { id, userId },
			data,
		});
	});
};

export const dbUpdateActiveStatus = async (
	id: string,
	userId: string,
	isActive: boolean,
) => {
	return await prisma.account.updateManyAndReturn({
		where: { id, userId },
		data: {
			isActive,
		},
	});
};
