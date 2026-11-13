import { getDashboard } from "@/api/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboard = (month?: string) => {
	return useQuery({
		queryKey: ["dashboard", month],
		queryFn: () => getDashboard(month!),
	});
};
