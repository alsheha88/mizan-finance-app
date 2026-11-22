import { getDebtPlan } from "@/api/debtPlanner";
import { queryKeys } from "@/lib/queryKeys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetDebtPlan = (extra: number) => {
	return useQuery({
		queryKey: queryKeys.debtPlan.byExtra(extra),
		queryFn: () => getDebtPlan(extra),
		placeholderData: keepPreviousData,
	});
};
