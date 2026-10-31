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
import { useGetCategories } from "@/hooks/categories";
import { useGetDashboard } from "@/hooks/dashboard";
import { useGetTransactions } from "@/hooks/transactions";
import { useTransactionsFilters } from "@/hooks/transactionsFilters";
import { capitalizeFirstLetter, getDateRange } from "@/lib/helpers";
import { Calendar, CircleDollarSign, Search } from "lucide-react";

function Income() {
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
	} = useTransactionsFilters();

	const { data, isError, isPending, refetch } = useGetTransactions({
		page,
		limit,
		type: "income",
		categoryId,
		search,
		accountId,
		month,
	});
	const { data: dashbaord } = useGetDashboard(month);
	const { data: categoriesArr } = useGetCategories();

	if (isPending) return <LoadingState />;
	if (isError)
		return (
			<ErrorState
				title={"Something Went Wrong!"}
				message={"We couldn't load your income transactions, please try again"}
				onAction={refetch}
			/>
		);

	const categories = categoriesArr?.filter((i) => i.appliesTo === "income");
	const options = [
		{ id: "all", label: "All" },
		...(categories?.map((i) => ({
			id: i.id,
			label: capitalizeFirstLetter(i.name),
		})) ?? []),
	];
	const monthOptions = getDateRange().map((i) => {
		return {
			label: i,
			value: i,
		};
	});

	return (
		<div className="flex flex-col gap-8 min-h-dvh">
			<PageHeader title={"Income"} subTitle="Every deposit, grouped by source.">
				<div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
					<Input
						type={"text"}
						placeholder="Search by merchant, category…"
						startIcon={<Search size={16} />}
						className="w-full sm:w-64"
						value={value}
						onChange={onSearch}
					/>
					<Select
						options={monthOptions}
						placeholder={"Select a period"}
						value={month}
						onValueChange={onMonthChange}
						startIcon={<Calendar className="stroke-text-tertiary" size={16} />}
						showChevron={false}
						ariaLabel="Select month"
						className="w-full sm:w-auto sm:min-w-3xs"
					/>
				</div>
			</PageHeader>
			{data.count > 0 ? (
				<>
					<StatCard
						title={"Total income"}
						subTitle={Number(dashbaord?.income ?? 0)}
					/>
					<FilterChips
						options={options}
						value={categoryId ?? "all"}
						onChange={handleChange}
					/>

					{data && <TransactionsTable transactions={data?.transactions} />}
					{data && (
						<Pagination
							page={page}
							count={data.count}
							limit={limit}
							onPageChange={onPageChange}
						/>
					)}
				</>
			) : (
				<EmptyState
					icon={
						<CircleDollarSign className="stroke-interactive-primary stroke-1" size={56} />
					}
					title={"No income transactions found"}
					message={
						"There are no income transactions found, please upload an account statement in the account page to see your income"
					}
				/>
			)}
		</div>
	);
}

export default Income;
