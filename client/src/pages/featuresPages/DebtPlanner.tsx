import DebtPlannerTable from "@/components/features/debtPlanner/DebtPlannerTable";
import StatCard from "@/components/features/shared/StatCard";
import { Card } from "@/components/primitives/Card";
import { Input } from "@/components/primitives/Input";
import LineChart from "@/components/primitives/LineChart";
import NoticeCard from "@/components/primitives/NoticeCard";
import PageHeader from "@/components/primitives/PageHeader";
import EmptyState from "@/components/state/EmptyState";
import ErrorState from "@/components/state/ErrorState";
import LoadingState from "@/components/state/LoadingState";
import { useDebouncedValue } from "@/hooks/custom/debouncedValue";
import { useGetDebtPlan } from "@/hooks/debtPlanner";
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
	const [extraText, setExtraText] = useState("150");
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
						{`${formatKWD(minimums)} installments + ${formatKWD(extra)} extra`}
					</small>
				</StatCard>
			</div>
			<Card className="grid gap-6">
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
					<Input
						type={"text"}
						inputMode="decimal"
						label="Extra payment per month"
            startIcon={<span className="text-body-sm">KWD</span>}
            className="ps-14"
						value={extraText}
						onChange={(e) => setExtraText(e.target.value)}
					/>
					<div className="flex flex-col gap-1.5">
						<p className="text-text-primary text-label-lg">How it works</p>
						<p className="text-text-secondary text-body-sm">
							Pay the minimum on every debt and put the extra on the smallest
							balance. When it's paid off, its payment rolls into the next one.
							The plan assumes no new spending on these cards.
						</p>
					</div>
				</div>
				<NoticeCard
					message="For Islamic financing, paying early only lowers the total if KFH gives an early-settlement discount. Check with the bank before you pay extra on a financing contract."
					noticeType="info"
				/>
			</Card>
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
