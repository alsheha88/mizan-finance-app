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
		<Card className="grid gap-4">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-1">
					<h4 className="text-h4 text-text-primary">
						{capitalizeFirstLetter(account.name)}
					</h4>

					<div className="flex items-center gap-2">
						<small className="text-caption-sm text-text-tertiary">
							{capitalizeFirstLetter(account.accountType)} Account
						</small>
						<div className="border-2 rounded-full border-text-tertiary"></div>
						<small className="text-caption-sm text-text-tertiary">
							{maskAccountNumber(account.accountNumber)}
						</small>
					</div>
				</div>
				<Badge color={account.isActive ? "mint" : "rose"}>
					{" "}
					{account.isActive ? "Active" : "Inactive"}{" "}
				</Badge>
			</div>
			<div className="flex flex-col gap-2">
				<p className="text-label-md text-text-secondary">Current balance</p>
				<h4 className="text-h4 text-text-primary tabular-nums">
					{accountBalance === undefined ? "--" : formatKWD(accountBalance)}
				</h4>
			</div>
			<div className="flex items-center justify-between">
				<small className="text-text-tertiary text-label-sm">
					{account.count > 0
						? `${account.count} transactions`
						: "No transactions"}
				</small>
				<small className="text-text-tertiary text-label-sm">
					{account.lastImportedAt
						? `Last import on ${formatDateMonthDay(account.lastImportedAt)}`
						: "No statement imported"}
				</small>
			</div>
			<div className="grid grid-cols-2 gap-2">
				<Button type="button" onClick={() => onUpload(account)}>
					Upload statement
				</Button>
				<Button
					variant="destructive"
					type="button"
					disabled={!account.count}
					onClick={() => setIsDialogOpen(true)}>
					Delete transactions
				</Button>
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
