import { api } from "@/lib/api";
import type {
	CreateLoanData,
	EditLoanData,
	Loan,
	LoanWithOutstanding,
} from "@/schema/loansSchema";
import type { IdParams } from "@/schema/userSchema";

type EditLoan = {
	params: IdParams;
	data: EditLoanData;
};

export const getLoans = async () => {
	const res = await api.get<{ data: { loans: LoanWithOutstanding[] } }>(
		"/api/loans",
	);

	return res.data.data.loans;
};

export const getLoan = async (params: IdParams) => {
	const res = await api.get<{ data: { loan: LoanWithOutstanding } }>(
		`/api/loans/${params.id}`,
	);

	return res.data.data.loan;
};

export const createLoan = async (data: CreateLoanData) => {
	const res = await api.post<{ data: { loan: Loan } }>("/api/loans", data);

	return res.data.data.loan;
};

export const editLoan = async ({ params, data }: EditLoan) => {
	const res = await api.patch<{ data: { loan: Loan } }>(
		`/api/loans/${params.id}`,
		data,
	);

	return res.data.data.loan;
};

export const deleteLoan = async (params: IdParams) => {
	const res = await api.delete<{ data: { message: string } }>(
		`/api/loans/${params.id}`,
	);

	return res.data.data.message;
};
