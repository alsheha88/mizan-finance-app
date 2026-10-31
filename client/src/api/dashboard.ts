import { api } from "@/lib/api";
import type { DashboardResponse } from "@/schema/dashboardSchema";

export const getDashboard = async (month: string) => {
	const res = await api.get<{ data: DashboardResponse }>("/api/dashboard", {
		params: {month},
	});

	return res.data.data;
};
