import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import Modal from "@/components/primitives/Modal";
import { ProgressBar } from "@/components/primitives/ProgressBar";
import { useDeleteLoan } from "@/hooks/loans";
import { formatKWD } from "@/lib/helpers";
import type { Loan, LoanWithOutstanding } from "@/schema/loansSchema";
import { Edit, Trash } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

type LoanCardProps = {
	loan: LoanWithOutstanding;
	setLoan: Dispatch<SetStateAction<Loan | null>>;
	setIsFormOpen: Dispatch<SetStateAction<boolean>>;
	setMode: Dispatch<SetStateAction<"add" | "edit">>;
};

function LoanCard({ loan, setLoan, setIsFormOpen, setMode }: LoanCardProps) {
	const { mutate: deleteLoan, isPending } = useDeleteLoan();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const onDelete = () => deleteLoan({ id: loan.id });
	return (
		<Card className="grid gap-4">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-1">
					<h4 className="text-h4 text-text-primary">{loan.name}</h4>
					<small className="text-caption-sm text-text-tertiary">
						Invoice {loan.invoiceNumber}
					</small>
				</div>
				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="ghost"
						className="hover:bg-transparent p-0"
						onClick={() => {
							setLoan(loan);
							setMode("edit");
							setIsFormOpen(true);
						}}>
						<Edit
							size={16}
							className="stroke-text-secondary hover:stroke-accent-foreground"></Edit>
					</Button>
					<Button
						type="button"
						variant="ghost"
						className="hover:bg-transparent p-0"
						onClick={() => setIsDialogOpen(true)}>
						<Trash
							size={16}
							className="stroke-text-secondary hover:stroke-ring-destructive"></Trash>
					</Button>
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<p className="text-label-md text-text-secondary">Outstanding</p>
				<h4 className="text-h4 text-text-primary">
					{formatKWD(Number(loan.outstanding))}
				</h4>
			</div>
			<div className="flex flex-col gap-1">
				<p className="text-label-md text-text-secondary">
					Monthly Installment
				</p>
				<h4 className="text-h4 text-text-primary">
					{formatKWD(Number(loan.installment))}
				</h4>
			</div>
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<p className="text-label-md text-text-secondary">Repaid</p>
					<p className="text-label-md text-text-secondary">
						{(
							((Number(loan.originalAmount) - Number(loan.outstanding)) /
								Number(loan.originalAmount)) *
							100
						).toFixed(1)}
						%
					</p>
				</div>

				<ProgressBar
					progress={
						((Number(loan.originalAmount) - Number(loan.outstanding)) /
							Number(loan.originalAmount)) *
						100
					}
					color={"mint"}
					label={"Repaid"}
				/>
			</div>
			<Modal
				title={"Delete"}
				item={loan.name}
				content={"Are you sure you want to delete the loan?"}
				btnContent={"Delete loan"}
				variant={"destructive"}
				onConfirm={onDelete}
				isPending={isPending}
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}></Modal>
		</Card>
	);
}

export default LoanCard;
