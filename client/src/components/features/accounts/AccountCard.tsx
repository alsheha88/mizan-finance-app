import Badge from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import Modal from "@/components/primitives/Modal";
import { useDeleteAccountTransactions } from "@/hooks/transactions";
import {
	capitalizeFirstLetter,
	formatDateMonthDay,
	formatKWD,
	maskAccountNumber,
} from "@/lib/helpers";
import type { AccountListItem } from "@/schema/accountsSchema";
import { useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { IconButton } from "@/components/primitives/IconButton";

type AccountCardProps = {
	account: AccountListItem;
	onUpload: (account: AccountListItem) => void;
};
function AccountCard({ account, onUpload }: AccountCardProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { mutate, isPending } = useDeleteAccountTransactions();
	const accountBalance =
		account.balance === undefined ? undefined : Number(account.balance);
	return (
		<Card className="grid grid-cols-[minmax(0,1fr)] gap-4 min-w-0">
			{/* Name and status on one row; the badge never shrinks, the name truncates. */}
			<div className="flex items-start justify-between gap-3">
				<div className="flex flex-col gap-1 min-w-0">
					<h4 className="text-h4 text-text-primary truncate" title={account.name}>
						{capitalizeFirstLetter(account.name)}
					</h4>
					<p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-caption-sm text-text-tertiary">
						<span>{capitalizeFirstLetter(account.accountType)} account</span>
						<span aria-hidden className="size-1 rounded-full bg-text-tertiary" />
						<span className="tabular-nums">
							{maskAccountNumber(account.accountNumber)}
						</span>
					</p>
				</div>
				<Badge className="shrink-0" color={account.isActive ? "mint" : "rose"}>
					{account.isActive ? "Active" : "Inactive"}
				</Badge>
			</div>

			<div className="flex flex-col gap-1">
				<p className="text-label-md text-text-secondary">Current balance</p>
				<p className="text-h3 text-text-primary tabular-nums">
					{accountBalance === undefined ? "--" : formatKWD(accountBalance)}
				</p>
			</div>

			<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-label-sm text-text-tertiary">
				<span>
					{account.count > 0
						? `${account.count} transactions`
						: "No transactions"}
				</span>
				<span>
					{account.lastImportedAt
						? `Last import on ${formatDateMonthDay(account.lastImportedAt)}`
						: "No statement imported"}
				</span>
			</div>

			{/* One main action. Deleting is rare and destructive, so it's a small
			    outlined icon button instead of a second full-size red button. */}
			<div className="flex gap-2">
				<Button
					type="button"
					className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap"
					onClick={() => onUpload(account)}>
					<Upload size={16} aria-hidden />
					Upload statement
				</Button>
				<IconButton
					label="Delete transactions"
					tone="destructive"
					icon={<Trash2 size={16} aria-hidden />}
					disabled={!account.count}
					onClick={() => setIsDialogOpen(true)}
				/>
			</div>
			<Modal
				title={`Delete ${account.name} transactions`}
				content={`Are you sure you want to delete all transactions linked to ${account.name}?`}
				btnContent={"Delete"}
				variant={"destructive"}
				onConfirm={() =>
					mutate(
						{ id: account.id },
						{
							onSuccess: () => {
								setIsDialogOpen(false);
							},
						},
					)
				}
				isPending={isPending}
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
			/>
			
		</Card>
	);
}

export default AccountCard;
