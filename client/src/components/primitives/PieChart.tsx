import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { chartColors } from "@/lib/paletteColors";
import Badge from "./Badge";
import { capitalizeFirstLetter, formatKWD } from "@/lib/helpers";
import type { DashboardResponse } from "@/schema/dashboardSchema";
import ChartEmpty from "../state/ChartEmpty";
import { PieChart as PieChartIcon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

type PieChartProps = {
	data: DashboardResponse;
};

const TOP_COUNT = 5;

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ data }: PieChartProps) {
	const { theme } = useTheme();
	const colors = chartColors[theme];

	if (data.spendingByCategory.length === 0) {
		return (
			<ChartEmpty
				icon={
					<PieChartIcon
						className="stroke-text-tertiary stroke-1"
						size={40}
						aria-hidden="true"
					/>
				}
				title="No spending this month"
				message="Categorised spending will appear here once there are expenses in this period."
			/>
		);
	}

	// Top 5 categories, plus everything else added up into one "Other" slice.
	// The list arrives sorted by total (largest first) from the server.
	const topCategories = data.spendingByCategory.slice(0, TOP_COUNT);
	const othersTotal = data.spendingByCategory
		.slice(TOP_COUNT)
		.reduce((acc, category) => acc + category.total, 0);

	const categories =
		data.spendingByCategory.length > TOP_COUNT
			? [
					...topCategories,
					{
						categoryId: "other",
						name: "other",
						color: "other" as const,
						total: othersTotal,
					},
				]
			: topCategories;

	const totals = categories.map((i) => i.total);
	const total = totals.reduce((acc, value) => acc + value, 0);

	const chartData = {
		labels: categories.map((i) => capitalizeFirstLetter(i.name)),
		datasets: [
			{
				label: "Spending by category",
				data: totals,
				backgroundColor: categories.map((i) =>
					i.color === null ? colors.palette.uncategorised : colors.palette[i.color],
				),
				borderColor: colors.sliceBorder,
				borderWidth: 1,
			},
		],
	};

	return (
		// Donut beside the legend when the card is wide (full-width card, md to xl),
		// above it on phones and in the narrow desktop column.
		<div className="flex flex-col md:flex-row xl:flex-col gap-6 items-center">
			{/* Fixed size: the donut never shrinks with the screen. */}
			<div className="relative size-48 shrink-0">
				<Doughnut
					data={chartData}
					options={{
						maintainAspectRatio: false,
						plugins: { legend: { display: false } },
					}}
				/>
			</div>

			{/* Columns follow the width the legend actually gets next to or below the donut. */}
			<div className="w-full min-w-0 md:flex-1 xl:flex-none grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-4">
				{categories.map((i) => (
					<div
						key={i.categoryId ?? "uncategorised"}
						className="flex items-center justify-between gap-4 py-1 border-b border-b-border-default">
						<div className="flex flex-col gap-1">
							<Badge color={i.color}>{capitalizeFirstLetter(i.name)}</Badge>
							<p className="text-caption-sm text-text-tertiary">
								{((i.total / total) * 100).toFixed(1)}%
							</p>
						</div>
						<p className="text-caption-sm text-text-primary tabular-nums">
							{formatKWD(i.total)}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default PieChart;