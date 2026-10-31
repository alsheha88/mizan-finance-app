import {
	createCardSchema,
	type CreateCardData,
	type CreditCard,
} from "@/schema/creditCardsSchema";
import { useEffect, useState } from "react";
import { Card } from "../primitives/Card";
import { Button } from "../primitives/Button";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Popover } from "../primitives/Popover";
import { DatePicker } from "../primitives/DatePicker";
import { useCreateCard, useEditCard } from "@/hooks/cards";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate, toCalendarDate } from "@/lib/helpers";
import { Input } from "../primitives/Input";
import { Select } from "../primitives/Select";
import { CARD_TYPE_LABELS, toOptions } from "@/lib/labels";

const toFormValues = (card: CreditCard | null): CreateCardData => ({
	cardNumber: card?.cardNumber ?? "",
	type: card?.type ?? "fullDeduction",
	limit: Number(card?.limit ?? 0),
	outstandingBalance: Number(card?.outstandingBalance ?? 0),
	expiryDate: card ? new Date(card.expiryDate) : toCalendarDate(new Date()),
	name: card?.name ?? ""
});

type CardFormProps = {
	mode: "add" | "edit";
	onClose: () => void;
	card: CreditCard | null;
};

function CardForm({ mode, onClose, card }: CardFormProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { mutate: createCard, isPending: isCreating } = useCreateCard();
	const { mutate: editCard, isPending: isEditing } = useEditCard();
	const {
		handleSubmit,
		register,
		reset,
		control,
		formState: { errors },
	} = useForm<CreateCardData>({
		resolver: zodResolver(createCardSchema),
		defaultValues: toFormValues(card),
	});
	const header = mode === "add" ? "Add card" : "Edit card";

	useEffect(() => {
		reset(toFormValues(card));
	}, [card, reset]);

	const onSubmit: SubmitHandler<CreateCardData> = (data) => {
		if (mode === "add") {
			createCard(data, {
				onSuccess: () => {
					onClose();
				},
			});
		} else {
			if (!card) return null;
			editCard(
				{ params: { id: card.id }, data },
				{
					onSuccess: () => {
						onClose();
					},
				},
			);
		}
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
			<Card className="grid gap-5 w-full max-w-sm max-h-[90dvh] overflow-y-auto">
				<h3 className="text-h3 text-text-primary">{header}</h3>
				<div className="border-[0.5px] border-border-subtle"></div>
				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
					<Input
						label="Card Name"
						type={"text"}
						error={errors.name?.message}
						{...register("name")}
					/>
					<Input
						label="Card number"
						type={"text"}
						disabled={mode === "edit"}
						error={errors.cardNumber?.message}
						{...register("cardNumber")}
					/>
					<Input
						label="Card limit"
						type={"number"}
						error={errors.limit?.message}
						{...register("limit", { valueAsNumber: true })}
					/>
					<Input
						label="Card Balance"
						type={"number"}
						error={errors.outstandingBalance?.message}
						{...register("outstandingBalance", { valueAsNumber: true })}
					/>

					<Controller
						name="type"
						control={control}
						render={({ field }) => (
							<Select
								label={"Card type"}
								options={toOptions(CARD_TYPE_LABELS)}
								value={field.value}
								onValueChange={field.onChange}
								placeholder={"Select card type"}
								error={errors.type?.message}
							/>
						)}
					/>

					<div className="grid gap-1.5">
						<p className="text-text-secondary text-caption-lg">Expiry Date</p>
						<Controller
							name="expiryDate"
							control={control}
							render={({ field }) => (
								<Popover
									triggerContent={formatDate(field.value)}
									open={isOpen}
									onOpenChange={setIsOpen}>
									<DatePicker
										selected={field.value}
										setSelected={field.onChange}
										setIsPopoverOpen={setIsOpen}
									/>
								</Popover>
							)}
						/>
					</div>
					<div className="border-[0.5px] border-border-subtle"></div>

					<div className="flex items-center justify-between">
						<Button type="button" variant="secondary" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={isCreating || isEditing}>
							{mode === "add" ? "Save card" : "Save changes"}
						</Button>
					</div>
				</form>
			</Card>
		</div>
	);
}

export default CardForm;
