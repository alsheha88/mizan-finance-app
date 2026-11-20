import {
	createCardSchema,
	type CreateCardData,
	type CreditCard,
} from "@/schema/creditCardsSchema";
import { useEffect, useState } from "react";
import { Button } from "../primitives/Button";
import {
	Controller,
	useForm,
	type DefaultValues,
	type SubmitHandler,
} from "react-hook-form";
import { Popover } from "../primitives/Popover";
import { DatePicker } from "../primitives/DatePicker";
import { useCreateCard, useEditCard } from "@/hooks/cards";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate, toCalendarDate } from "@/lib/helpers";
import { Input } from "../primitives/Input";
import { Select } from "../primitives/Select";
import { CARD_TYPE_LABELS, toOptions } from "@/lib/labels";
import { FormDialog } from "@/components/primitives/FormDialog";
import type { CardType } from "@/schema/enums";

const toFormValues = (
	card: CreditCard | null,
): DefaultValues<CreateCardData> => ({
	name: card?.name ?? "",
	cardLast4: card?.cardLast4 ?? "",
	type: card?.type ?? "fullDeduction",
	expiryDate: card ? new Date(card.expiryDate) : toCalendarDate(new Date()),
	...(card && {
		creditLimit: Number(card.creditLimit),
		outstandingBalance: Number(card.outstandingBalance),
	}),
	installmentPercentage:
		card?.installmentPercentage == null
			? null
			: Number(card?.installmentPercentage),
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
		watch,
		setValue,
		getValues,
	} = useForm<CreateCardData>({
		resolver: zodResolver(createCardSchema),
		defaultValues: toFormValues(card),
	});
	const header = mode === "add" ? "Add card" : "Edit card";
	const cardType = watch("type");

	useEffect(() => {
		reset(toFormValues(card));
	}, [card, reset]);

	const handleTypeChange = (value: CardType) => {
		if (value === "installment" && getValues("installmentPercentage") == null) {
			setValue("installmentPercentage", 8.33);
		} else if (value === "fullDeduction") {
			setValue("installmentPercentage", null);
		}
	};

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
		<FormDialog
			title={header}
			onClose={onClose}
			canClose={!(isCreating || isEditing)}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="sm:col-span-2">
					<Input
						label="Card name"
						type={"text"}
						error={errors.name?.message}
						{...register("name")}
					/>
				</div>
				<Input
					label="Last 4 digits"
					type={"text"}
					disabled={mode === "edit"}
					inputMode="numeric"
					maxLength={4}
					error={errors.cardLast4?.message}
					{...register("cardLast4")}
				/>
				<Controller
					name="type"
					control={control}
					render={({ field }) => (
						<Select
							label={"Card type"}
							options={toOptions(CARD_TYPE_LABELS)}
							value={field.value}
							onValueChange={(value) => {
								field.onChange(value);
								handleTypeChange(value as CardType);
							}}
							placeholder={"Select card type"}
							error={errors.type?.message}
						/>
					)}
				/>
				<Input
					label="Card limit"
					type={"number"}
					step="0.001"
					placeholder="e.g. 3000.000"
					error={errors.creditLimit?.message}
					{...register("creditLimit", { valueAsNumber: true })}
				/>
				<Input
					label="Card balance"
					type={"number"}
					step="0.001"
					placeholder="e.g. 850.000"
					error={errors.outstandingBalance?.message}
					{...register("outstandingBalance", { valueAsNumber: true })}
				/>
				{cardType === "installment" && (
					<Input
						label="Installment percentage"
						type={"number"}
						step="0.01"
						placeholder="e.g. 8.33"
						error={errors.installmentPercentage?.message}
						{...register("installmentPercentage", {
							setValueAs: (value) => (value === "" || value == null ? null : Number(value)),
						})}
					/>
				)}

				<div className={`grid gap-1.5 ${cardType === "installment" ? "" : "sm:col-span-2"}`}>
					<p className="text-text-secondary text-caption-lg">Expiry date</p>
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
				<div className="flex items-center justify-between sm:col-span-2">
					<Button type="button" variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" disabled={isCreating || isEditing}>
						{mode === "add" ? "Save card" : "Save changes"}
					</Button>
				</div>
			</form>
		</FormDialog>
	);
}

export default CardForm;
