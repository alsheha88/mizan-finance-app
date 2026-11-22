import { api } from "@/lib/api";
import type { DebtPlanResponse } from "@/schema/debtPlannerSchema";

export const getDebtPlan = async (extra: number) => {
	const res = await api.get<{ data: { plan: DebtPlanResponse } }>(
		`/api/debt-plan`,
		{ params: { extra } },
	);

	return res.data.data.plan;
};
