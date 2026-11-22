import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { chartColors } from "@/lib/paletteColors";
import { monthsFromNow } from "@/lib/helpers";
import { useTheme } from "@/context/ThemeContext";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);

type LineChartProps = {
	startTotal: number;
	withPlanTotals: number[];
	withoutPlanTotals: number[];
};

function LineChart({
	startTotal,
	withPlanTotals,
	withoutPlanTotals,
}: LineChartProps) {
	const { theme } = useTheme();
	const colors = chartColors[theme];

	const debt = {
		labels: Array.from({ length: withoutPlanTotals.length + 1 }, (_, i) =>
			monthsFromNow(i),
		),
		datasets: [
			{
				label: "With snowball",
				data: [startTotal, ...withPlanTotals],
				backgroundColor: colors.palette.mint,
				borderColor: colors.palette.mint,
				pointRadius: 0,
				pointHoverRadius: 4,
			},
			{
				label: "Do nothing",
				data: [startTotal, ...withoutPlanTotals],
				backgroundColor: colors.palette.other,
				borderColor: colors.palette.other,
				borderDash: [4, 4],
				pointRadius: 0,
				pointHoverRadius: 4,
			},
		],
	};

	return (
		<div className="relative flex-1 min-h-64">
			<Line
				data={debt}
				options={{
					maintainAspectRatio: false,
					scales: {
						x: {
							ticks: { color: colors.tick, maxTicksLimit: 6 },
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
					plugins: {
						legend: {
							labels: {
								usePointStyle: true,
								pointStyle: "line",
								color: chartColors[theme].palette.uncategorised,
							},
						},
					},
				}}
			/>
		</div>
	);
}

export default LineChart;
