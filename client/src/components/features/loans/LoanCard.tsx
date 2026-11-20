import { Card } from "@/components/primitives/Card";
import Modal from "@/components/primitives/Modal";
import { ProgressBar } from "@/components/primitives/ProgressBar";
import { useDeleteLoan } from "@/hooks/loans";
import { formatKWD } from "@/lib/helpers";
import type { Loan, LoanWithOutstanding } from "@/schema/loansSchema";
import { Pencil, Trash2 } from "lucide-react";
import { IconButton } from "@/components/primitives/IconButton";
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
	const original = Number(loan.originalAmount);
	const outstanding = Number(loan.outstanding);
	const repaid = original > 0 ? ((original - outstanding) / original) * 100 : 0;
	return (
		<Card className="grid grid-cols-[minmax(0,1fr)] gap-4 min-w-0">
			{/* Name on the left, edit and delete as small icons on the right
			    (a loan has no main action like "Upload statement"). */}
			<div className="flex items-start justify-between gap-3">
				<div className="flex flex-col gap-1 min-w-0">
					<h4 className="text-h4 text-text-primary truncate" title={loan.name}>
						{loan.name}
					</h4>
					<p className="text-caption-sm text-text-tertiary tabular-nums">
						Invoice {loan.invoiceNumber}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<IconButton
						label="Edit loan"
						icon={<Pencil size={16} aria-hidden />}
						onClick={() => {
							setLoan(loan);
							setMode("edit");
							setIsFormOpen(true);
						}}
					/>
					<IconButton
						label="Delete loan"
						tone="destructive"
						icon={<Trash2 size={16} aria-hidden />}
						onClick={() => setIsDialogOpen(true)}
					/>
				</div>
			</div>

			{/* What's left as the big number, the installment as a line under it. */}
			<div className="flex flex-col gap-1">
				<p className="text-label-md text-text-secondary">Outstanding</p>
				<p className="text-h3 text-text-primary tabular-nums">
					{formatKWD(outstanding)}
				</p>
				<p className="text-label-sm text-text-tertiary tabular-nums">
					{formatKWD(Number(loan.installment))} per month
				</p>
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between text-label-md text-text-secondary">
					<p>Repaid</p>
					<p className="tabular-nums">{repaid.toFixed(1)}%</p>
				</div>
				<ProgressBar progress={repaid} color={"mint"} label={"Repaid"} />
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
