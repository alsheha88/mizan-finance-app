import LoanCard from "@/components/features/loans/LoanCard";
import StatCard from "@/components/features/shared/StatCard";
import LoanForm from "@/components/forms/LoanForm";
import { Button } from "@/components/primitives/Button";
import PageHeader from "@/components/primitives/PageHeader";
import EmptyState from "@/components/state/EmptyState";
import ErrorState from "@/components/state/ErrorState";
import LoadingState from "@/components/state/LoadingState";
import { useGetLoans } from "@/hooks/loans";
import type { Loan } from "@/schema/loansSchema";
import { TrendingDown } from "lucide-react";
import { useState } from "react";

function Loans() {
	const { data, isError, isPending, refetch } = useGetLoans();
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [mode, setMode] = useState<"add" | "edit">("add");
	const [loan, setLoan] = useState<Loan | null>(null);

	if (isPending) return <LoadingState />;
	if (isError)
		return (
			<ErrorState
				title={"Something Went Wrong!"}
				message={"We couldn't load your loans, please try again"}
				onAction={refetch}
			/>
		);

	const totalInstallments = data
		?.map((i) => Number(i.installment))
		.reduce((acc, b) => acc + b, 0);
	return (
		<div className="flex flex-col gap-8 min-h-dvh">
			<PageHeader title={"Loans"} subTitle="Track your loans, monitor repayments, and stay on top of your debt.">
				<Button
					type="button"
					onClick={() => {
						setLoan(null);
						setMode("add");
						setIsFormOpen(true);
					}}>
					Add loan
				</Button>
			</PageHeader>
			{data.length > 0 ? (
				<>
					<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
						<StatCard
							title="Total installments"
							subTitle={totalInstallments}></StatCard>
					</div>
					<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
						{data.map((i) => (
							<LoanCard
								key={i.id}
								loan={i}
								setLoan={setLoan}
								setIsFormOpen={setIsFormOpen}
								setMode={setMode}
							/>
						))}
					</div>
				</>
			) : (
				<EmptyState
					icon={<TrendingDown className="stroke-interactive-primary stroke-1" size={56} />}
					title={"No loans found"}
					message={
						"There are no loans found, please add a loan using the add loan button"
					}
				/>
			)}
			{isFormOpen && (
				<LoanForm mode={mode} setIsFormOpen={setIsFormOpen} loan={loan} />
			)}
		</div>
	);
}

export default Loans;
