import { stripUndefined, toMatchKey } from "../../lib/helpers";
import { prisma } from "../../lib/prisma";
import type { CreateRecurringPaymentData } from "../../schema/recurringPayment";

export const dbCreateRecurringPayment = async (
	userId: string,
	data: CreateRecurringPaymentData,
) => {
	const transaction =
		data.source === "bank"
			? await prisma.transaction.findFirst({
					where: {
						userId,
						id: data.transactionId,
						type: "expense",
						recurringPaymentId: null,
					},
				})
			: await prisma.cardTransaction.findFirst({
					where: {
						userId,
						id: data.transactionId,
						cardTransactionType: "purchase",
						recurringPaymentId: null,
					},
				});
	if (!transaction) return null;
	const matchKey = toMatchKey(transaction.merchant);
	const recurringPayment = await prisma.$transaction(async (tx) => {
		const created = await tx.recurringPayment.create({
			data: {
				name: data.name,
				expectedAmount: data.expectedAmount,
				expectedDay: data.expectedDay,
				categoryId: data.categoryId ?? null,
				matchKey,
				amountVaries: data.amountVaries ?? false,
				userId,
			},
		});
		if (data.source === "bank") {
			await tx.transaction.updateMany({
				where: { userId, id: data.transactionId },
				data: { recurringPaymentId: created.id },
			});
		} else {
			await tx.cardTransaction.updateMany({
				where: { userId, id: data.transactionId },
				data: { recurringPaymentId: created.id },
			});
		}

		return created;
	});
	return recurringPayment;
};
