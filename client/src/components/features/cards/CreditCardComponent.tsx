import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import Modal from "@/components/primitives/Modal";
import { useDeleteCard } from "@/hooks/cards";
import { formatKWD } from "@/lib/helpers";
import { CARD_TYPE_LABELS } from "@/lib/labels";
import type { CreditCard } from "@/schema/creditCardsSchema";
import { Pencil, Trash2, Upload } from "lucide-react";
import { IconButton } from "@/components/primitives/IconButton";
import { ProgressBar } from "@/components/primitives/ProgressBar";
import { useState } from "react";

type CreditCardProps = {
	card: CreditCard;
	onUpload: (card: CreditCard) => void;
	onEdit: (card: CreditCard) => void;
};

function CreditCardComponent({ card, onUpload, onEdit }: CreditCardProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { mutate: deleteCard, isPending } = useDeleteCard();
	const limit = Number(card.limit);
	const balance = Number(card.outstandingBalance);
	const utilization = limit > 0 ? (balance / limit) * 100 : 0;

	return (
		<Card className="grid grid-cols-[minmax(0,1fr)] gap-4 min-w-0">
			{/* Name and details on the left, edit on the right; the name truncates. */}
			<div className="flex items-start justify-between gap-3">
				<div className="flex flex-col gap-1 min-w-0">
					<h4 className="text-h4 text-text-primary truncate" title={card.name}>
						{card.name}
					</h4>
					<p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-caption-sm text-text-tertiary">
						<span>{CARD_TYPE_LABELS[card.type]}</span>
						<span aria-hidden className="size-1 rounded-full bg-text-tertiary" />
						<span className="tabular-nums">ending {card.cardNumber}</span>
					</p>
				</div>
				<IconButton
					label="Edit card"
					icon={<Pencil size={16} aria-hidden />}
					onClick={() => onEdit(card)}
				/>
			</div>

			{/* Balance against the limit, with how much of it is used. */}
			<div className="grid gap-2">
				<div className="flex flex-col gap-1">
					<p className="text-label-md text-text-secondary">Balance</p>
					<p className="text-h3 text-text-primary tabular-nums">
						{formatKWD(balance)}
					</p>
					<p className="text-label-sm text-text-tertiary tabular-nums">
						of {formatKWD(limit)} limit
					</p>
				</div>
				<ProgressBar
					progress={utilization}
					color={utilization >= 80 ? "rose" : utilization >= 50 ? "amber" : "mint"}
					label="Limit used"
				/>
				<p className="text-label-sm text-text-tertiary tabular-nums">
					{utilization.toFixed(0)}% used
				</p>
			</div>

			{/* One main action, delete as a small icon next to it (as on accounts). */}
			<div className="flex gap-2">
				<Button
					type="button"
					className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap"
					onClick={() => onUpload(card)}>
					<Upload size={16} aria-hidden />
					Upload statement
				</Button>
				<IconButton
					label="Delete card"
					tone="destructive"
					icon={<Trash2 size={16} aria-hidden />}
					onClick={() => setIsDialogOpen(true)}
				/>
			</div>

			<Modal
				title={`Delete ${card.name}`}
				content={`This also permanently deletes every transaction imported from this card. This can't be undone.`}
				btnContent={"Delete"}
				variant={"destructive"}
				onConfirm={() =>
					deleteCard(
						{ id: card.id },
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

export default CreditCardComponent;
