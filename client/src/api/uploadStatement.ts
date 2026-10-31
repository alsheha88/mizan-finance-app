import { api } from "@/lib/api";
import type {
	CardTransactionResponse,
	TransactionResponse,
} from "@/schema/transactionsSchema";

type UploadAccountStatement = {
	accountId: string;
	file: File;
};
type UploadCardStatement = {
	creditCardId: string;
	file: File;
};

export const uploadAccountStatement = async ({
	accountId,
	file,
}: UploadAccountStatement) => {
	const formData = new FormData();
	formData.append("statement", file);
	formData.append("accountId", accountId);

	const res = await api.post<{
		data: { transactions: TransactionResponse[]; skipped: number };
	}>("/api/statement/upload", formData);

	return res.data.data;
};

export const uploadCardStatement = async ({
	creditCardId,
	file,
}: UploadCardStatement) => {
	const formData = new FormData();
	formData.append("statement", file);
	formData.append("creditCardId", creditCardId);

	const res = await api.post<{
		data: { transactions: CardTransactionResponse[] };
	}>("/api/statement/upload-card", formData);

	return res.data.data.transactions;
};
