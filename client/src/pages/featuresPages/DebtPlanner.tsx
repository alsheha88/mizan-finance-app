import DebtPlannerTable from "@/components/features/debtPlanner/DebtPlannerTable";
import PlanControls from "@/components/features/debtPlanner/PlanControls";
import StatCard from "@/components/features/shared/StatCard";
import { Card } from "@/components/primitives/Card";
import LineChart from "@/components/primitives/LineChart";
import PageHeader from "@/components/primitives/PageHeader";
import EmptyState from "@/components/state/EmptyState";
import ErrorState from "@/components/state/ErrorState";
import LoadingState from "@/components/state/LoadingState";
import { useDebouncedValue } from "@/hooks/custom/debouncedValue";
import { useGetDebtPlan } from "@/hooks/debtPlanner";
import { useGetUser } from "@/hooks/user";
import {
	formatKWD,
	getDuration,
	monthsFromNow,
	plural,
	toSafeExtra,
} from "@/lib/helpers";
import { CalendarCheck2Icon } from "lucide-react";
import { useState } from "react";

function DebtPlanner() {
	const { data: user, isPending, isError, refetch } = useGetUser();

	if (isPending) return <LoadingState />;
	if (isError)
		return (
			<ErrorState
				title={"Something went wrong!"}
				message={"We couldn't load your profile, please try again"}
				onAction={refetch}
			/>
		);

	const savedExtra = Number(user.debtPlannerExtra ?? 0);
	return <DebtPlannerContent savedExtra={savedExtra} />;
}

function DebtPlannerContent({ savedExtra }: { savedExtra: number }) {
	const [extraText, setExtraText] = useState(String(savedExtra));
	const extra = useDebouncedValue(toSafeExtra(extraText));
	const { data, isPending, isError, refetch } = useGetDebtPlan(extra);

	if (isPending) return <LoadingState />;
	if (isError)
		return (
			<ErrorState
				title={"Something went wrong!"}
				message={"We couldn't load your debt plan, please try again"}
				onAction={refetch}
			/>
		);
	if (data.order.length === 0)
		return (
			<EmptyState
				icon={<CalendarCheck2Icon />}
				title={"No credit cards or loans found to build your debt plan"}
				message={
					"Add your installment cards and loans to see when you'll be debt-free."
				}
			/>
		);

	const totalDebt = data.order.reduce((acc, b) => acc + b.balance, 0);
	const minimums = data.withPlan.monthlyBudget - extra;
	const cardCount = data.order.filter((i) => i.kind === "card").length;
	const loanCount = data.order.filter((i) => i.kind === "loan").length;

	const debtParts: string[] = [];
	if (cardCount > 0) debtParts.push(plural(cardCount, "card"));
	if (loanCount > 0) debtParts.push(plural(loanCount, "loan"));

	return (
		<div className="flex flex-col gap-8 min-h-dvh">
			<PageHeader
				title={"Debt planner"}
				as="h1"
				subTitle="Pay off your debts faster with the snowball method."
			/>

			<div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
				<StatCard title={"Debt-free by"}>
					{monthsFromNow(data.withPlan.month)}
					<small className="text-text-tertiary text-caption-sm">
						{getDuration(data.monthsSaved)} sooner
					</small>
				</StatCard>
				<StatCard title={"Total debt"}>
					{formatKWD(totalDebt)}
					<small className="text-text-tertiary text-caption-sm">
						{debtParts.join(" + ")}
					</small>
				</StatCard>
				<StatCard title={"Monthly toward debt"}>
					{formatKWD(data.withPlan.monthlyBudget)}
					<small className="text-text-tertiary text-caption-sm">
						{`${formatKWD(minimums)} installments + ${formatKWD(savedExtra)} extra`}
					</small>
				</StatCard>
			</div>
			<PlanControls
				extraText={extraText}
				setExtraText={setExtraText}
				savedExtra={savedExtra}
			/>
			<Card>
				<div className="flex flex-col gap-1">
					<h4 className="text-h4 text-text-primary">Remaining debt</h4>
					<p className="text-text-secondary text-body-sm">
						How your total balance falls month by month.
					</p>
				</div>

				<LineChart
					withPlanTotals={data.withPlan.totals}
					withoutPlanTotals={data.withoutPlan.totals}
					startTotal={totalDebt}
				/>
			</Card>
			<div className="grid gap-4">
				<PageHeader
					title={"Payoff order"}
					as="h2"
					subTitle="Smallest balance first. When one is paid off, its payment rolls into the next."
				/>
				<DebtPlannerTable order={data.order} />
			</div>
		</div>
	);
}

export default DebtPlanner;
