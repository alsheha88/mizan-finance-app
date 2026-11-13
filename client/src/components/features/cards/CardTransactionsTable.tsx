import Badge from "@/components/primitives/Badge";
import { Input } from "@/components/primitives/Input";
import { Select } from "@/components/primitives/Select";
import { Table, TCell, TH, THead, TRow } from "@/components/primitives/Table";
import { useGetCategories } from "@/hooks/categories";
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
	const [value, setValue] = useState("");
	const { data } = useGetCategories();
	const { mutate } = useEditCardTransaction();
	const categories = data?.filter((c) => c.appliesTo === "expense");

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	const onBlur = () => {
		setEditing(null);
	};

	const isEditing = (id: string, field: EditingCell["field"]) =>
		editing?.id === id && editing.field === field;
	return (
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
				{transactions.length > 0 ? (
					transactions.map((t) => {
						const categoriesOptions = categories?.map((i) => {
							return {
								label: capitalizeFirstLetter(i.name),
								value: i.id,
							};
						});
						return (
							<TRow key={t.id}>
								<TCell>{formatDate(t.transactionDate)}</TCell>
								<TCell className="flex flex-col gap-1">
									{isEditing(t.id, "merchant") ? (
										<Input
											className="w-max p-1"
											type={"text"}
											autoFocus
											value={value}
											onChange={onChange}
											onBlur={onBlur}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													mutate({
														data: { merchant: value },
														params: { id: t.id },
													});
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
									)}
									<p className="text-body-sm text-text-tertiary">
										{t.description}
									</p>
								</TCell>

								<TCell>
									{t.cardTransactionType === "payment" ? (
										<Badge color="mint">Payment</Badge>
									) : isEditing(t.id, "category") ? (
										categoriesOptions && (
											<Select
												className="p-2 w-max"
												options={categoriesOptions}
												placeholder={"Select category"}
												value={t.categoryId ?? undefined}
												ariaLabel="Select category"
												defaultOpen
												onOpenChange={(open) => {
													if (!open) setEditing(null);
												}}
												onValueChange={(categoryId) => {
													mutate({
														data: { categoryId },
														params: { id: t.id },
													});
													setEditing(null);
												}}
											/>
										)
									) : (
										<button
											type="button"
											className="cursor-pointer"
											aria-label="Change category"
											onClick={() =>
												setEditing({ id: t.id, field: "category" })
											}>
											{t.category ? (
												<Badge color={t.category.color}>
													{capitalizeFirstLetter(t.category.name)}
												</Badge>
											) : (
												<Badge color={null}>Unassigned</Badge>
											)}
										</button>
									)}
								</TCell>

								<TCell className="text-text-secondary">{t.card?.name}</TCell>
								<TCell className="text-end tabular-nums">
									{formatKWD(Number(t.amount))}
								</TCell>
							</TRow>
						);
					})
				) : (
					<TRow>
						<TCell colSpan={5} className="text-center text-text-tertiary">
							No transactions found
						</TCell>
					</TRow>
				)}
			</tbody>
		</Table>
	);
}

export default CardTransactionsTable;
