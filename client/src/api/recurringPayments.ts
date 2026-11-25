import { api } from "@/lib/api";
import type {
	CreateRecurringPaymentData,
	RecurringPaymentsResponse,
	TransactionLinkData,
	UpdateRecurringPaymentData,
} from "@/schema/recurringPaymentsSchema";
import type { IdParams } from "@/schema/userSchema";

type EditRecurringPayment = {
	params: IdParams;
	data: UpdateRecurringPaymentData;
};

type LinkTransaction = {
	params: IdParams;
	data: TransactionLinkData;
};

type CreatedRecurringPayment = {
	recurringPayment: { id: string; name: string };
	linkedCount: number;
};

export const getRecurringPayments = async () => {
	const res = await api.get<{ data: RecurringPaymentsResponse }>(
		"/api/recurring-payments",
	);

	return res.data.data;
};

export const createRecurringPayment = async (
	data: CreateRecurringPaymentData,
) => {
	const res = await api.post<{ data: CreatedRecurringPayment }>(
		"/api/recurring-payments",
		data,
	);

	return res.data.data;
};

export const editRecurringPayment = async ({
	params,
	data,
}: EditRecurringPayment) => {
	const res = await api.patch<{ data: { recurringPayment: { id: string } } }>(
		`/api/recurring-payments/${params.id}`,
		data,
	);

	return res.data.data.recurringPayment;
};

export const deleteRecurringPayment = async (params: IdParams) => {
	const res = await api.delete<{ data: { message: string } }>(
		`/api/recurring-payments/${params.id}`,
	);

	return res.data.data.message;
};

export const linkTransaction = async ({ params, data }: LinkTransaction) => {
	const res = await api.post<{ data: { message: string } }>(
		`/api/recurring-payments/${params.id}/link`,
		data,
	);

	return res.data.data.message;
};

export const unlinkTransaction = async (data: TransactionLinkData) => {
	const res = await api.post<{ data: { message: string } }>(
		"/api/recurring-payments/unlink",
		data,
	);

	return res.data.data.message;
};
