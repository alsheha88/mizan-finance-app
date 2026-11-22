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
import { useTheme } from "@/context/ThemeContext";
import { chartColors } from "@/lib/paletteColors";

ChartJs.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type BarChartProps = {
	data: {
		year: number;
		monthIndex: number;
		income: number;
		expense: number;
	}[];
};

function BarChart({ data }: BarChartProps) {
	const { theme } = useTheme();
	const colors = chartColors[theme];
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

	const cashflow = {
		labels: data.map((i) => getShortMonthName(i.monthIndex + 1)),
		datasets: [
			{
				label: "Income",
				data: data.map((i) => i.income),
				backgroundColor: colors.income,
				borderRadius: 4,
			},
			{
				label: "Expense",
				data: data.map((i) => i.expense),
				backgroundColor: colors.expense,
				borderRadius: 4,
			},
		],
	};

	return (
		<div className="relative flex-1 min-h-64">
			<Bar
				data={cashflow}
				options={{
					maintainAspectRatio: false,
					color: colors.tick,
					scales: {
						x: {
							ticks: { color: colors.tick },
							grid: { color: colors.grid },
						},
						y: {
							ticks: {
								color: colors.tick,
								callback: (value) => {
									const n = Number(value);
									return Math.abs(n) >= 1000 ? `${n / 1000}k KWD` : `${n} KWD`;
								},
							},
							grid: { color: colors.grid },
						},
					},
				}}
			/>
		</div>
	);
}

export default BarChart;