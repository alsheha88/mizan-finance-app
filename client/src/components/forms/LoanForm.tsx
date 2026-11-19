import { useCreateLoan, useEditLoan } from "@/hooks/loans";
import {
	createLoanSchema,
	type CreateLoanData,
	type Loan,
} from "@/schema/loansSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
	Controller,
	useForm,
	type DefaultValues,
	type SubmitHandler,
} from "react-hook-form";
import { Button } from "../primitives/Button";
import { Input } from "../primitives/Input";
import { DatePicker } from "../primitives/DatePicker";
import { Popover } from "../primitives/Popover";
import { formatDate, toCalendarDate } from "@/lib/helpers";
import { FormDialog } from "@/components/primitives/FormDialog";

const toFormValues = (loan: Loan | null): DefaultValues<CreateLoanData> => ({
	name: loan?.name ?? "",
	invoiceNumber: loan?.invoiceNumber ?? "",
	startDate: loan ? new Date(loan.startDate) : toCalendarDate(new Date()),
	lastInstallmentDate: loan
		? new Date(loan.lastInstallmentDate)
		: toCalendarDate(new Date()),
	...(loan && {
		installment: Number(loan.installment),
		originalAmount: Number(loan.originalAmount),
	}),
});

type LoanFormProps = {
	mode: "add" | "edit";
	setIsFormOpen: Dispatch<SetStateAction<boolean>>;
	loan: Loan | null;
};

function LoanForm({ mode, setIsFormOpen, loan }: LoanFormProps) {
	const [isStartOpen, setIsStartOpen] = useState(false);
	const [isEndOpen, setIsEndOpen] = useState(false);
	const header = mode === "add" ? "Add loan" : "Edit loan";
	const { mutate: createLoan, isPending: isCreating } = useCreateLoan();
	const { mutate: editLoan, isPending: isEditing } = useEditLoan();
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		reset,
	} = useForm<CreateLoanData>({
		resolver: zodResolver(createLoanSchema),
		defaultValues: toFormValues(loan),
	});

	useEffect(() => {
		reset(toFormValues(loan));
	}, [loan, reset]);

	const onClose = () => setIsFormOpen(false);

	const onSubmit: SubmitHandler<CreateLoanData> = (data) => {
		if (mode === "add") {
			createLoan(data, { onSuccess: onClose });
		} else {
			if (!loan) return;
			editLoan({ params: { id: loan.id }, data }, { onSuccess: onClose });
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
					<Input
						label="Loan name"
						type={"text"}
						placeholder="e.g. Car loan"
						error={errors.name?.message}
						{...register("name")}
					/>
					<Input
						label="Invoice number"
						type={"text"}
						inputMode="numeric"
						error={errors.invoiceNumber?.message}
						{...register("invoiceNumber")}
					/>
					<Input
						label="Monthly installment"
						type={"number"}
						step="0.001"
						placeholder="e.g. 350.000"
						error={errors.installment?.message}
						{...register("installment", { valueAsNumber: true })}
					/>
					<Input
						label="Loan amount"
						type={"number"}
						step="0.001"
						placeholder="e.g. 15000.000"
						error={errors.originalAmount?.message}
						{...register("originalAmount", { valueAsNumber: true })}
					/>

					<div className="grid gap-1.5 sm:col-span-2">
						<p className="text-text-secondary text-caption-lg">Start date</p>
						<Controller
							name="startDate"
							control={control}
							render={({ field }) => (
								<Popover
									triggerContent={formatDate(field.value)}
									open={isStartOpen}
									onOpenChange={setIsStartOpen}>
									<DatePicker
										selected={field.value}
										setSelected={field.onChange}
										setIsPopoverOpen={setIsStartOpen}
									/>
								</Popover>
							)}
						/>
					</div>

					<div className="grid gap-1.5 sm:col-span-2">
						<p className="text-text-secondary text-caption-lg">
							Last installment date
						</p>
						<Controller
							name="lastInstallmentDate"
							control={control}
							render={({ field }) => (
								<Popover
									triggerContent={formatDate(field.value)}
									open={isEndOpen}
									onOpenChange={setIsEndOpen}>
									<DatePicker
										selected={field.value}
										setSelected={field.onChange}
										setIsPopoverOpen={setIsEndOpen}
									/>
								</Popover>
							)}
						/>
						{errors.lastInstallmentDate?.message && (
							<small className="text-caption-sm text-ring-destructive">
								{errors.lastInstallmentDate.message}
							</small>
						)}
					</div>

					<div className="flex items-center justify-between sm:col-span-2">
						<Button type="button" variant="secondary" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={isCreating || isEditing}>
							{mode === "add" ? "Save loan" : "Save changes"}
						</Button>
					</div>
				</form>
		</FormDialog>
	);
}

export default LoanForm;