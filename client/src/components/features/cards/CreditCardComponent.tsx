import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import Modal from "@/components/primitives/Modal";
import { useDeleteCard } from "@/hooks/cards";
import { formatKWD } from "@/lib/helpers";
import { CARD_TYPE_LABELS } from "@/lib/labels";
import type { CreditCard } from "@/schema/creditCardsSchema";
import { Edit } from "lucide-react";
import { useState } from "react";

type CreditCardProps = {
	card: CreditCard;
	onUpload: (card: CreditCard) => void;
	onEdit: (card: CreditCard) => void;
};

function CreditCardComponent({ card, onUpload, onEdit }: CreditCardProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { mutate: deleteCard, isPending } = useDeleteCard();

	return (
		<Card className="grid gap-4">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-1">
					<h4 className="text-h4 text-text-primary">{card.name}</h4>
					<div className="flex items-center gap-2">
						<small className="text-caption-sm text-text-tertiary">
							{CARD_TYPE_LABELS[card.type]}
						</small>
						<div className="border-2 rounded-full border-text-tertiary"></div>
						<small className="text-caption-sm text-text-tertiary">
							ending {card.cardNumber}
						</small>
					</div>
				</div>
				<Button
					type="button"
					variant="ghost"
					className="hover:bg-transparent p-0"
					aria-label="Edit card"
					onClick={() => onEdit(card)}>
					<Edit
						className="stroke-text-secondary hover:stroke-ring-default"
						size={16}
						aria-hidden="true"
					/>
				</Button>
			</div>
			<div className="flex flex-col gap-2">
				<p className="text-label-md text-text-secondary">Card limit</p>
				<h4 className="text-h4 text-text-primary">
					{formatKWD(Number(card.limit))}
				</h4>
			</div>
			<Button type="button" onClick={() => onUpload(card)}>
				Upload statement
			</Button>
			<Button
				type="button"
				variant="destructive"
				onClick={() => setIsDialogOpen(true)}>
				Delete Card
			</Button>

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
