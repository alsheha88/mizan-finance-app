import Badge from "@/components/primitives/Badge";
import { Card } from "@/components/primitives/Card";
import { Input } from "@/components/primitives/Input";
import { Select } from "@/components/primitives/Select";
import { Table, TCell, TH, THead, TRow } from "@/components/primitives/Table";
import { useGetCategories } from "@/hooks/categories";
import { useMediaQuery } from "@/hooks/mediaQuery";
import { useEditCardTransaction } from "@/hooks/transactions";
import { capitalizeFirstLetter, formatDate, formatKWD } from "@/lib/helpers";
import type { CardTransaction } from "@/schema/creditCardsSchema";
import { useState, type ChangeEvent } from "react";

type CardTransactionsTableProps = {
	transactions: CardTransaction[];
};

type EditingCell = {
	id: string;
	field: "merchant" | "category";
};

function CardTransactionsTable({ transactions }: CardTransactionsTableProps) {
	const [editing, setEditing] = useState<EditingCell | null>(null);
	// Tailwind's lg breakpoint (64rem). Only one layout is rendered at a time.
	const isDesktop = useMediaQuery("(min-width: 64rem)");
	const [value, setValue] = useState("");
	const { data } = useGetCategories();
	const { mutate } = useEditCardTransaction();

	// Card purchases are always expenses, so only expense categories apply.
	const categoryOptions = (data ?? [])
		.filter((c) => c.appliesTo === "expense")
		.map((c) => ({ label: capitalizeFirstLetter(c.name), value: c.id }));

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	const isEditing = (id: string, field: EditingCell["field"]) =>
		editing?.id === id && editing.field === field;

	// The merchant name, editable in place. Shared by the table and the card list.
	const merchantCell = (t: CardTransaction) =>
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

	// The category badge, swapping to a select when picked. Card payments aren't categorised.
	const categoryCell = (t: CardTransaction) => {
		if (t.cardTransactionType === "payment")
			return <Badge color="mint">Payment</Badge>;

		if (isEditing(t.id, "category")) {
			return (
				<Select
					className="w-44"
					options={categoryOptions}
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
					<Badge color={null}>Uncategorised</Badge>
				)}
			</button>
		);
	};

	console.log(transactions)

	if (transactions.length === 0) {
		return (
			<div className="rounded-md border border-border-default py-10 text-center text-body-sm text-text-tertiary">
				No transactions found
			</div>
		);
	}

	return (
		<>
			{isDesktop ? (
				<div className="min-w-0">
					<Table>
						<THead>
							<TRow>
								<TH>Date</TH>
								<TH>Merchant/Description</TH>
								<TH>Category</TH>
								<TH>Card</TH>
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
											<p
												className="text-body-sm text-text-tertiary line-clamp-1"
												title={t.description}>
												{t.description}
											</p>
										</div>
									</TCell>
									<TCell>{categoryCell(t)}</TCell>
									<TCell className="whitespace-nowrap text-text-secondary">
										{t.card?.name}
									</TCell>
									<TCell className={`text-end whitespace-nowrap tabular-nums ${t.cardTransactionType === "payment" ? "text-financial-gain-fg" : ""}`}>
										{`${t.cardTransactionType === "payment" ? "–" : ""}${formatKWD(Number(t.amount))}`}
									</TCell>
								</TRow>
							))}
						</tbody>
					</Table>
				</div>
			) : (
				<div className="grid gap-3">
					{transactions.map((t) => (
						<Card key={t.id} className="grid gap-3">
							<div className="flex items-start justify-between gap-3">
								<div className="flex flex-col gap-1 min-w-0">
									{merchantCell(t)}
									<p
										className="text-body-sm text-text-tertiary wrap-break-word line-clamp-2"
										title={t.description}>
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
									<span>{t.card?.name}</span>
									<span aria-hidden="true">·</span>
									<span>{formatDate(t.transactionDate)}</span>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}
		</>
	);
}

export default CardTransactionsTable;
