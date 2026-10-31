import AccountCard from "@/components/features/accounts/AccountCard";
import UploadStatementModal from "@/components/features/accounts/UploadStatementModal";
import StatCard from "@/components/features/shared/StatCard";
import AccountForm from "@/components/forms/AccountForm";
import { Button } from "@/components/primitives/Button";
import PageHeader from "@/components/primitives/PageHeader";
import EmptyState from "@/components/state/EmptyState";
import ErrorState from "@/components/state/ErrorState";
import LoadingState from "@/components/state/LoadingState";
import { useGetAccounts } from "@/hooks/accounts";
import { useGetDashboard } from "@/hooks/dashboard";
import { calculatePercentage, getCurrentMonth } from "@/lib/helpers";
import type { AccountListItem } from "@/schema/accountsSchema";
import { Wallet } from "lucide-react";
import { useState } from "react";

function Accounts() {
	const [account, setAccount] = useState<AccountListItem | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [formMode, setFormMode] = useState<"add" | "edit">("add");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { data: accounts, isError, isPending, refetch } = useGetAccounts();
	const { data } = useGetDashboard(getCurrentMonth());

	if (isPending) return <LoadingState />;
	if (isError)
		return (
			<ErrorState
				title={"Something Went Wrong!"}
				message={"We couldn't load your accounts please try again"}
				onAction={refetch}
			/>
		);

	if (accounts?.length === 0)
		return (
			<>
				<EmptyState
					icon={<Wallet className="stroke-interactive-primary stroke-1" size={56} />}
					title={"No accounts found"}
					message={
						"You have no linked accounts, please create an account by clicking the below button"
					}>
					<Button
						type="button"
						onClick={() => {
							setAccount(null);
							setFormMode("add");
							setIsFormOpen(true);
						}}>
						Add account
					</Button>
				</EmptyState>
				{isFormOpen && (
					<AccountForm
						mode={formMode}
						onClose={() => setIsFormOpen(false)}
						account={account}
					/>
				)}
			</>
		);
	const income = Number(data?.income);
	const expenses = Number(data?.expenses);
	const totalBalance =
		accounts?.reduce((sum, a) => sum + Number(a.balance ?? 0), 0) ?? 0;
	return (
		<div className="flex flex-col gap-8 min-h-dvh">
			<PageHeader
				title={"Accounts"}
				subTitle="Your bank accounts and their imported statements.">
				<Button
					type="button"
					onClick={() => {
						setAccount(null);
						setFormMode("add");
						setIsFormOpen(true);
					}}>
					Add account
				</Button>
			</PageHeader>
			{data && (
				<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
					<StatCard title={"Total across accounts"} subTitle={totalBalance}>
						<small className="text-text-tertiary text-label-sm">
							{accounts?.length} accounts connected
						</small>
					</StatCard>
					<StatCard title={"Money in this month"} subTitle={income}>
						<small className="text-text-tertiary text-label-sm">
							{calculatePercentage(
								data.cashflow[4]?.income ?? 0,
								data.cashflow[5]?.income ?? 0,
							).toFixed(1)}
							% vs last month
						</small>
					</StatCard>
					<StatCard title={"Money out this month"} subTitle={expenses}>
						<small className="text-text-tertiary text-label-sm">
							{calculatePercentage(
								data.cashflow[4]?.expense ?? 0,
								data.cashflow[5]?.expense ?? 0,
							).toFixed(1)}
							% vs last month
						</small>
					</StatCard>
				</div>
			)}
			<div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
				{accounts?.map((i) => (
					<AccountCard
						key={i.id}
						account={i}
						onUpload={(account) => {
							setAccount(account);
							setIsModalOpen(true);
						}}
					/>
				))}
			</div>
			{isFormOpen && (
				<AccountForm
					mode={formMode}
					onClose={() => setIsFormOpen(false)}
					account={account}
				/>
			)}
			{isModalOpen && account && (
				<UploadStatementModal
					account={account}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</div>
	);
}

export default Accounts;
