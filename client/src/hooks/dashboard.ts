import { queryKeys } from "@/lib/queryKeys";
import { getDashboard } from "@/api/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboard = (month?: string) => {
	return useQuery({
		queryKey: queryKeys.dashboard.byMonth(month),
		queryFn: () => getDashboard(month!),
	});
};
