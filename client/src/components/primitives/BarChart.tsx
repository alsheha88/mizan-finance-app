import { getShortMonthName } from "@/lib/helpers";
import {
	Chart as ChartJs,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartEmpty from "../state/ChartEmpty";
import { BarChart3 } from "lucide-react";

ChartJs.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
);

type BarChartProps = {
	data: {
		year: number;
		monthIndex: number;
		income: number;
		expense: number;
	}[];
};

function BarChart({ data }: BarChartProps) {
	const hasAnyActivity = data.some((i) => i.income > 0 || i.expense > 0);

	if (!hasAnyActivity) {
		return (
			<ChartEmpty
				icon={
					<BarChart3
						className="stroke-text-tertiary stroke-1"
						size={40}
						aria-hidden="true"
					/>
				}
				title="No cashflow to show"
				message="Income and expenses will appear here once statements are imported for these months."
			/>
		);
	}

	const income = data.map((i) => i.income);
	const expense = data.map((i) => i.expense);
	const labels = data.map((i) => getShortMonthName(i.monthIndex + 1));
	const cashflow = {
		labels,
		datasets: [
			{
				label: "Income",
				data: income,
				backgroundColor: "rgba(61, 220, 151, 1)",
				borderRadius: 4,
				color: "rgba(61, 220, 151, 1)",
			},
			{
				label: "Expense",
				data: expense,
				backgroundColor: "rgba(255, 107, 157, 1)",
				borderRadius: 4,
				color: "rgba(255, 107, 157, 1)",
			},
		],
	};

	return (
		<Bar
			data={cashflow}
			className="text-text-secondary"
			options={{
				color: "#6f6494",
				scales: {
					x: {
						ticks: {
							color: "#6f6494",
						},
					},
					y: {
						ticks: { color: "#6f6494" },
					},
				},
			}}
		/>
	);
}

export default BarChart;
