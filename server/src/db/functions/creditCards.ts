import { prisma } from "../../lib/prisma";

export const dbGetCreditCards = async (userId: string) => {
	return await prisma.creditCard.findMany({ where: { userId } });
};
export const dbGetCreditCard = async (userId: string, id: string) => {
	return await prisma.creditCard.findFirst({ where: { userId, id } });
};
export const dbCreateCreditCard = async (userId: string, ) => {
	return await prisma.creditCard.findFirst({ where: { userId } });
};
