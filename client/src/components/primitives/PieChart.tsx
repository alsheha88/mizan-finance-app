import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { PALETTECOLOR, UNCATEGORISED } from "@/lib/paletteColors";
import Badge from "./Badge";
import { capitalizeFirstLetter, formatKWD } from "@/lib/helpers";
import type { DashboardResponse } from "@/schema/dashboardSchema";
import ChartEmpty from "../state/ChartEmpty";
import { PieChart as PieChartIcon } from "lucide-react";

type PieChartProps = {
	data: DashboardResponse;
}

ChartJS.register(ArcElement, Tooltip, Legend);
function PieChart({data}:PieChartProps) {

	const labels = data.spendingByCategory.map((i) => i.name);
	const colors = data.spendingByCategory.map((i) =>
		i.color === null ? UNCATEGORISED : PALETTECOLOR[i.color],
	);
	const totals = data.spendingByCategory.map((i) => i.total);
	const total = totals.reduce((acc, b) => (acc + b), 0);

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

	const chartData = {
		labels,
		datasets: [
			{
				label: "Spending by category",
				data: totals,
				backgroundColor: colors,
				borderColor: colors,
			},
		],
	};

	return (
		<div className="flex flex-col gap-6 items-center">
			<div className="w-37.5 h-37.5">
				<Doughnut
					options={{
						maintainAspectRatio: false,
						plugins: { legend: { display: false } },
					}}
					data={chartData}></Doughnut>
			</div>

			<div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
				{data.spendingByCategory.map((i) => (
					<div
						key={i.categoryId ?? "uncategorised"}
						className="flex items-center justify-between gap-4 py-1 border-b border-b-border-default">
						<div className="flex flex-col gap-1">
							<Badge color={i.color}>
								{capitalizeFirstLetter(i.name)}
							</Badge>
							<p className="text-caption-sm text-text-tertiary">
								{((i.total / total) * 100).toFixed(1)}%
							</p>
						</div>
						<p className="text-caption-sm text-text-primary">
							{formatKWD(i.total)}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default PieChart;
