import { formatMonthLabel, getCurrentMonth } from "@/lib/helpers";
import { useGetDashboard } from "./dashboard";

export const useMonthOptions = () => {
	const { data } = useGetDashboard();
	const availableMonths = data?.availableMonths;
    const current = getCurrentMonth()
	if (!availableMonths?.length)
		return [{
			value: current,
			label:  formatMonthLabel(current),
		}];

	const monthsOptions = availableMonths.map((i) => {
		return {
			value: i,
			label: formatMonthLabel(i),
		};
	});

	return monthsOptions;
};
