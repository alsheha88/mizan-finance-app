import { api } from "@/lib/api";
import type {
	CreateUser,
	LoginUser,
	UpdateUser,
	User,
} from "@/schema/userSchema";

export const login = async (data: LoginUser) => {
	const res = await api.post<{ data: { accessToken: string } }>(
		"/api/auth/login",
		data,
	);

	return res.data.data.accessToken;
};
export const signup = async (data: CreateUser) => {
	const res = await api.post<{ data: { user: User } }>(
		"/api/auth/signup",
		data,
	);

	return res.data.data.user;
};
export const logout = async () => {
	const res = await api.post<{ data: { message: string } }>("/api/auth/logout");

	return res.data.data.message;
};

export const getUser = async () => {
	const res = await api.get<{ data: { user: User } }>("/api/auth/me");

	return res.data.data.user;
};

export const editUser = async (data: UpdateUser) => {
	const res = await api.patch<{ data: { user: User } }>("/api/auth/me", data);

	return res.data.data.user;
};

export const deleteUser = async () => {
	const res = await api.delete<{ data: { message: string } }>("/api/auth/me");

	return res.data.data.message;
};
