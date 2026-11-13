import Badge from "@/components/primitives/Badge";
import { Card } from "@/components/primitives/Card";
import { Input } from "@/components/primitives/Input";
import { Select } from "@/components/primitives/Select";
import { TRow, TH, TCell, THead, Table } from "@/components/primitives/Table";
import { useGetCategories } from "@/hooks/categories";
import { useEditTransaction } from "@/hooks/transactions";
import { capitalizeFirstLetter, formatDate, formatKWD } from "@/lib/helpers";
import type { TransactionListItem } from "@/schema/transactionsSchema";
import { useState, type ChangeEvent } from "react";

type TransactionsTableProps = {
	transactions: TransactionListItem[];
};

type EditingCell = {
	id: string;
	field: "merchant" | "category";
};

type Option = { label: string; value: string };

function TransactionsTable({ transactions }: TransactionsTableProps) {
	const [editing, setEditing] = useState<EditingCell | null>(null);
	const [value, setValue] = useState("");
	const { mutate } = useEditTransaction();
	const { data } = useGetCategories();

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	const isEditing = (id: string, field: EditingCell["field"]) =>
		editing?.id === id && editing.field === field;

	const optionsFor = (t: TransactionListItem): Option[] =>
		(data ?? [])
			.filter((c) => c.appliesTo === t.type)
			.map((c) => ({ label: capitalizeFirstLetter(c.name), value: c.id }));

	// The merchant name, editable in place. Shared by the table and the card list.
	const merchantCell = (t: TransactionListItem) =>
		isEditing(t.id, "merchant") ? (
			<Input
				className="w-full max-w-60 p-1"
				type="text"
				autoFocus
				value={value}
				onChange={onChange}
				onBlur={() => setEditing(null)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						mutate({ data: { merchant: value }, params: { id: t.id } });
						setEditing(null);
					} else if (e.key === "Escape") {
						setEditing(null);
					}
				}}
			/>
		) : (
			<button
				type="button"
				className="text-start cursor-pointer"
				onClick={() => {
					setEditing({ id: t.id, field: "merchant" });
					setValue(t.merchant);
				}}>
				{t.merchant}
			</button>
		);

	// The category badge, swapping to a select when picked. Transfers aren't categorised.
	const categoryCell = (t: TransactionListItem) => {
		if (t.type === "transfer") return <Badge color="mint">Transfer</Badge>;

		if (isEditing(t.id, "category")) {
			return (
				<Select
					className="p-2 w-40"
					options={optionsFor(t)}
					placeholder="Select category"
					value={t.categoryId ?? undefined}
					ariaLabel="Select category"
					defaultOpen
					onOpenChange={(open) => {
						if (!open) setEditing(null);
					}}
					onValueChange={(categoryId) => {
						mutate({ data: { categoryId }, params: { id: t.id } });
						setEditing(null);
					}}
				/>
			);
		}

		return (
			<button
				type="button"
				className="cursor-pointer"
				aria-label="Change category"
				onClick={() => setEditing({ id: t.id, field: "category" })}>
				{t.category ? (
					<Badge color={t.category.color}>
						{capitalizeFirstLetter(t.category.name)}
					</Badge>
				) : (
					<Badge color={null}>Unassigned</Badge>
				)}
			</button>
		);
	};

	if (transactions.length === 0) {
		return (
			<div className="rounded-md border border-border-default py-10 text-center text-body-sm text-text-tertiary">
				No transactions found
			</div>
		);
	}

	return (
		<>
			{/* Phones and small tablets: one card per transaction. */}
			<div className="grid gap-3 md:hidden">
				{transactions.map((t) => (
					<Card key={t.id} className="grid gap-3">
						<div className="flex items-start justify-between gap-3">
							<div className="flex flex-col gap-1 min-w-0">
								{merchantCell(t)}
								<p className="text-body-sm text-text-tertiary wrap-break-word">
									{t.description}
								</p>
							</div>
							<p className="text-body-sm text-text-primary whitespace-nowrap tabular-nums">
								{formatKWD(Number(t.amount))}
							</p>
						</div>
						<div className="flex items-center justify-between gap-3 flex-wrap">
							{categoryCell(t)}
							<div className="flex items-center gap-2 text-caption-sm text-text-tertiary">
								<span>{t.account.name}</span>
								<span aria-hidden="true">·</span>
								<span>{formatDate(t.transactionDate)}</span>
							</div>
						</div>
					</Card>
				))}
			</div>

			{/* Tablet and up: the full table. */}
			<div className="hidden md:block">
				<Table>
					<THead>
						<TRow>
							<TH>Date</TH>
							<TH>Merchant/Description</TH>
							<TH>Category</TH>
							<TH>Account</TH>
							<TH className="text-end">Amount</TH>
						</TRow>
					</THead>
					<tbody>
						{transactions.map((t) => (
							<TRow key={t.id}>
								<TCell className="whitespace-nowrap">
									{formatDate(t.transactionDate)}
								</TCell>
								<TCell>
									<div className="flex flex-col gap-1">
										{merchantCell(t)}
										<p className="text-body-sm text-text-tertiary">
											{t.description}
										</p>
									</div>
								</TCell>
								<TCell>{categoryCell(t)}</TCell>
								<TCell className="whitespace-nowrap">{t.account.name}</TCell>
								<TCell className="text-end whitespace-nowrap">
									{formatKWD(Number(t.amount))}
								</TCell>
							</TRow>
						))}
					</tbody>
				</Table>
			</div>
		</>
	);
}

export default TransactionsTable;
