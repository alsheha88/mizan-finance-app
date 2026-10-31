import { useLocation, useNavigate } from "react-router-dom";
import {
	getUser,
	login,
	logout,
	signup,
	editUser,
	deleteUser,
} from "../api/auth";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { clearAuthToken, getApiErrorMessage, setAuthToken } from "@/lib/api";

export const useGetUser = () => {
	return useQuery({
		queryKey: ["me"],
		queryFn: getUser,
		retry: false,
	});
};
export const useLogin = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const location = useLocation();

	const from =
		(location.state as { from?: { pathname: string } } | null)?.from
			?.pathname ?? "/dashboard";

	return useMutation({
		mutationFn: login,
		onSuccess: (token) => {
			setAuthToken(token);
			queryClient.invalidateQueries({ queryKey: ["me"] });
			navigate(from, { replace: true });
			toast.success("Welcome back!");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
export const useSignup = () => {
	const navigate = useNavigate();
	return useMutation({
		mutationFn: signup,
		onSuccess: () => {
			navigate("/login");
			toast.success("Signup Successful, Please login with your credintials");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
export const useEditUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: editUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["me"] });
			toast.success("Changes Saved");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
export const useDeleteUser = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
			navigate("/login");
			clearAuthToken();
			queryClient.clear();
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
export const useLogout = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			toast.success("Logout successful");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
		onSettled: () => {
			clearAuthToken();
			queryClient.clear();
			navigate("/login");
		},
	});
};
