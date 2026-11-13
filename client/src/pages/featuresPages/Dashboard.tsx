import StatCard from "@/components/features/shared/StatCard";
import TransactionsTable from "@/components/features/shared/TransactionsTable";
import BarChart from "@/components/primitives/BarChart";
import { Card } from "@/components/primitives/Card";
import PageHeader from "@/components/primitives/PageHeader";
import PieChart from "@/components/primitives/PieChart";
import { Select } from "@/components/primitives/Select";
import EmptyState from "@/components/state/EmptyState";
import ErrorState from "@/components/state/ErrorState";
import LoadingState from "@/components/state/LoadingState";
import { useGetAccounts } from "@/hooks/accounts";
import { useGetDashboard } from "@/hooks/dashboard";
import { useTransactionsFilters } from "@/hooks/transactionsFilters";
import { getDateRange } from "@/lib/helpers";
import { Calendar, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

function Dashboard() {
	const { month, onMonthChange } = useTransactionsFilters();
	const { data, isError, isPending, refetch } = useGetDashboard(month);
	const {
		data: accounts,
		isPending: isAccountsPending,
		isError: isAccountsError,
	} = useGetAccounts();

	if (isPending || isAccountsPending) return <LoadingState />;
	if (isError || isAccountsError)
		return (
			<ErrorState
				title={"Something Went Wrong!"}
				message={"We couldn't load your dashboard, please try again"}
				onAction={refetch}
			/>
		);

	const monthOptions = getDateRange().map((i) => {
		return {
			label: i,
			value: i,
		};
	});

	const hasAccounts = (accounts?.length ?? 0) > 0;

	return hasAccounts ? (
		<div className="flex flex-col gap-8 min-h-dvh">
			<PageHeader title={"Dashboard"} subTitle="Your money at a glance.">
				<Select
					options={monthOptions}
					placeholder={"Select a period"}
					value={month ?? data.month}
					onValueChange={onMonthChange}
					startIcon={<Calendar className="stroke-text-tertiary" size={16} />}
					showChevron={false}
					ariaLabel="Select month"
					className="w-full sm:w-auto sm:min-w-3xs"
				/>
			</PageHeader>
			<div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3">
				<StatCard
					title={"Income this month"}
					subTitle={Number(data.income)}></StatCard>
				<StatCard
					title={"Expenses this month"}
					subTitle={Number(data.expenses)}></StatCard>
				<StatCard
					title={"Net cash flow"}
					subTitle={Number(data.income) - Number(data.expenses)}></StatCard>
				<StatCard
					title={"Total outstanding debt"}
					subTitle={Number(data.debtStats.outstandingLoan)}></StatCard>
			</div>
			<div className="grid grid-cols-1 gap-4">
				<Card>
					<BarChart data={data.cashflow} />
				</Card>
				<Card>
					<PieChart data={data} />
				</Card>
			</div>
			<div className="grid gap-4">
				<PageHeader
					title="Recent Transactions"
					as="h2"
					subTitle="Latest activity across all accounts"
				/>
				<TransactionsTable transactions={data.recentTransactions} />
			</div>
		</div>
	) : (
		<EmptyState
			icon={
				<LayoutDashboard
					className="stroke-interactive-primary stroke-1"
					size={56}
				/>
			}
			title={"No data to display"}
			message={
				"Please head to accounts to start by creating your first account and uploading an account statement"
			}>
			<Link
				to={"/accounts"}
				className="px-4 py-2 rounded-sm bg-interactive-primary text-interactive-primary-foreground text-button-md">
				Accounts
			</Link>
		</EmptyState>
	);
}

export default Dashboard;
