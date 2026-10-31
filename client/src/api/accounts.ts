import { api } from "@/lib/api";
import type {
	Account,
	AccountListItem,
	ActiveAccountData,
	CreateAccountData,
	EditAccountData,
} from "@/schema/accountsSchema";
import type { IdParams } from "@/schema/userSchema";

type UpdateAccountActiveStatusData = {
	params: IdParams;
	data: ActiveAccountData;
};
type EditAccount = {
	params: IdParams;
	data: EditAccountData;
};
export const getAccounts = async () => {
	const res = await api.get<{ data: { accounts: AccountListItem[] } }>(
		`/api/accounts`,
	);

	return res.data.data.accounts;
};
export const getAccount = async (params: IdParams) => {
	const res = await api.get<{ data: { account: Account } }>(
		`/api/accounts/${params.id}`,
	);

	return res.data.data.account;
};
export const editAccount = async ({ params, data }: EditAccount) => {
	const res = await api.patch<{ data: { account: Account } }>(
		`/api/accounts/${params.id}`,
		data,
	);

	return res.data.data.account;
};
export const updateAccountActiveStatus = async ({
	params,
	data,
}: UpdateAccountActiveStatusData) => {
	const res = await api.patch<{ data: { account: Account } }>(
		`/api/accounts/${params.id}/active`,
		data,
	);

	return res.data.data.account;
};

export const createAccount = async (data: CreateAccountData) => {
	const res = await api.post<{ data: { account: Account } }>(
		`/api/accounts`,
		data,
	);

	return res.data.data.account;
};
