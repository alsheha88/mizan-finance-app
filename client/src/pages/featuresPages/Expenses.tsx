import StatCard from "@/components/features/shared/StatCard";
import TransactionsTable from "@/components/features/shared/TransactionsTable";
import { FilterChips } from "@/components/primitives/FilterChips";
import { Input } from "@/components/primitives/Input";
import PageHeader from "@/components/primitives/PageHeader";
import { Pagination } from "@/components/primitives/Pagination";
import { Select } from "@/components/primitives/Select";
import EmptyState from "@/components/state/EmptyState";
import ErrorState from "@/components/state/ErrorState";
import LoadingState from "@/components/state/LoadingState";
import { useMonthOptions } from "@/hooks/availableMonths";
import { useGetCategories } from "@/hooks/categories";
import { useGetDashboard } from "@/hooks/dashboard";
import { useGetTransactions } from "@/hooks/transactions";
import { useTransactionsFilters } from "@/hooks/transactionsFilters";
import { capitalizeFirstLetter } from "@/lib/helpers";
import { ArrowUpRight, Calendar, Search } from "lucide-react";

function Expenses() {
	const {
		page,
		limit,
		categoryId,
		accountId,
		search,
		month,
		value,
		onMonthChange,
		onPageChange,
		onSearch,
		handleChange,
		isUncategorised,
	} = useTransactionsFilters();
	const {
		data: dashbaord,
		isError: isDashboardError,
		refetch: refetchDashboard,
	} = useGetDashboard(month);
	const selectedMonth = month ?? dashbaord?.month;

	const { data, isError, isPending, refetch } = useGetTransactions(
		{
			page,
			limit,
			type: "expense",
			categoryId,
			search,
			accountId,
			month: selectedMonth,
			uncategorised: isUncategorised,
		},
		!!selectedMonth,
	);

	const { data: categoriesArr } = useGetCategories();
	const monthOptions = useMonthOptions();

	if (isError || isDashboardError)
		return (
			<ErrorState
				title={"Something Went Wrong!"}
				message={"We couldn't load your expenses, please try again"}
				onAction={() => {
					if (isDashboardError) {
						refetchDashboard();
					}
					if (isError) {
						refetch();
					}
				}}
			/>
		);
	if (isPending) return <LoadingState />;

	const categories = categoriesArr?.filter((i) => i.appliesTo === "expense");
	const options = [
		{ id: "all", label: "All" },
		...(categories?.map((i) => ({
			id: i.id,
			label: capitalizeFirstLetter(i.name),
		})) ?? []),
		{ id: "uncategorised", label: "Uncategorised" },
	];

	const isFiltered = !!categoryId || !!search || isUncategorised;
	return (
		<div className="flex flex-col gap-8 min-h-dvh">
			<PageHeader
				title={"Expenses"}
				subTitle="Every expense, grouped by category.">
				<div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
					<Input
						type={"text"}
						placeholder="Search by merchant, category…"
						startIcon={<Search size={16} />}
						wrapperClassName="w-full sm:w-64"
						value={value}
						onChange={onSearch}
					/>
					<Select
						options={monthOptions}
						placeholder={"Select a period"}
						value={selectedMonth}
						onValueChange={onMonthChange}
						startIcon={<Calendar className="stroke-text-tertiary" size={16} />}
						showChevron={false}
						ariaLabel="Select month"
						className="w-full sm:w-auto sm:min-w-3xs"
					/>
				</div>
			</PageHeader>
			<FilterChips
				options={options}
				value={isUncategorised ? "uncategorised" : (categoryId ?? "all")}
				onChange={handleChange}
			/>
			{data.count > 0 ? (
				<>
					<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
						<StatCard
							title={"Total expenses"}
							subTitle={Number(dashbaord?.expenses ?? 0)}
						/>
						<StatCard
							title={"Largest category"}
							subTitle={capitalizeFirstLetter(
								dashbaord?.spendingByCategory[0]?.name ?? "",
							)}></StatCard>
						<StatCard
							title={"Transactions recorded"}
							subTitle={data.count.toString()}
						/>
					</div>
					<TransactionsTable transactions={data?.transactions} />

					<Pagination
						page={page}
						count={data.count}
						limit={limit}
						onPageChange={onPageChange}
					/>
				</>
			) : isFiltered ? (
				<EmptyState
					icon={
						<ArrowUpRight
							className="text-interactive-primary stroke-1"
							size={56}
						/>
					}
					title={"No matching transactions"}
					message={"Try another category or search term”"}
				/>
			) : (
				<EmptyState
					icon={
						<ArrowUpRight
							className="text-interactive-primary stroke-1"
							size={56}
						/>
					}
					title={"No expenses found"}
					message={
						"There are no expenses found, please upload an account statement in the account page to see your expenses"
					}
				/>
			)}
		</div>
	);
}

export default Expenses;
