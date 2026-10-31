import axios from "axios";
import type { AxiosError } from "axios";

let memoryToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});

api.interceptors.request.use((config) => {
	if (memoryToken) {
		config.headers["Authorization"] = `Bearer ${memoryToken}`;
	}
	return config;
});

export const setAuthToken = (token: string) => {
	memoryToken = token;
};
export const refresh = async () => {
	const res = await api.post<{ data: { accessToken: string } }>(
		"/api/auth/refresh",
	);

	return res.data.data.accessToken;
};
export const clearAuthToken = () => {
	memoryToken = null;
};
const isAuthEndpoint = (url: string): boolean => {
	if (
		url.includes("/api/auth/login") ||
		url.includes("/api/auth/signup") ||
		url.includes("/api/auth/refresh")
	)
		return true;

	return false;
};

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest._retry &&
			!isAuthEndpoint(originalRequest.url ?? "")
		) {
			originalRequest._retry = true;
			try {
				if (!refreshPromise) {
					refreshPromise = refresh().finally(() => {
						refreshPromise = null;
					});
				}

				const newAccessToken = await refreshPromise;
				setAuthToken(newAccessToken);

				return api(originalRequest);
			} catch (refreshError) {
				clearAuthToken();
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);

export const getApiErrorMessage = (error: unknown): string => {
	const axiosError = error as AxiosError<{
		error?: { message: string };
		message?: string;
	}>;

	if (axiosError?.response?.data?.error?.message) {
		return axiosError.response.data.error.message;
	}

	if (axiosError?.response?.data?.message) {
		return axiosError.response.data.message;
	}

	return "Something went wrong";
};
