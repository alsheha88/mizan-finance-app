import { useCreateLoan, useEditLoan } from "@/hooks/loans";
import {
	createLoanSchema,
	type CreateLoanData,
	type Loan,
} from "@/schema/loansSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "../primitives/Button";
import { Card } from "../primitives/Card";
import { Input } from "../primitives/Input";
import { DatePicker } from "../primitives/DatePicker";
import { Popover } from "../primitives/Popover";
import { formatDate, toCalendarDate } from "@/lib/helpers";

const toFormValues = (loan: Loan | null): CreateLoanData => ({
	name: loan?.name ?? "",
	invoiceNumber: loan?.invoiceNumber ?? "",
	installment: Number(loan?.installment ?? 0),
	originalAmount: Number(loan?.originalAmount ?? 0),
	startDate: loan ? new Date(loan.startDate) : toCalendarDate(new Date()),
	lastInstallmentDate: loan
		? new Date(loan.lastInstallmentDate)
		: toCalendarDate(new Date()),
	
});

type LoanFormProps = {
	mode: "add" | "edit";
	setIsFormOpen: Dispatch<SetStateAction<boolean>>;
	loan: Loan | null;
};

function LoanForm({ mode, setIsFormOpen, loan }: LoanFormProps) {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const header = mode === "add" ? "Add loan" : "Edit loan";
	const { mutate: createLoan, isPending } = useCreateLoan();
	const { mutate: editLoan } = useEditLoan();
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

	const onSubmit: SubmitHandler<CreateLoanData> = (data) => {
		if (mode === "add") {
			createLoan(data, {
				onSuccess: () => {
					setIsFormOpen(false);
				},
			});
		} else {
			if (!loan) return;
			editLoan(
				{ params: { id: loan.id }, data },
				{
					onSuccess: () => {
						setIsFormOpen(false);
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
							label="Loan name"
							type={"text"}
							error={errors.name?.message}
							{...register("name")}
						/>
						<Input
							label="Invoice number"
							type={"text"}
							error={errors.invoiceNumber?.message}
							{...register("invoiceNumber")}
						/>
						<Input
							label="Installment"
							type={"number"}
							error={errors.installment?.message}
							{...register("installment", { valueAsNumber: true })}
						/>
						<Input
							label="Loan amount"
							type={"number"}
							error={errors.originalAmount?.message}
							{...register("originalAmount", { valueAsNumber: true })}
						/>
						<Controller
							name="startDate"
							control={control}
							render={({ field }) => (
								<Popover
									triggerContent={formatDate(field.value)}
									open={isOpen}
									onOpenChange={() => setIsOpen(!isOpen)}>
									<DatePicker
										selected={field.value}
										setSelected={field.onChange}
										setIsPopoverOpen={setIsOpen}
									/>
								</Popover>
							)}
						/>

						<Controller
							name="lastInstallmentDate"
							control={control}
							render={({ field }) => (
								<Popover
									triggerContent={formatDate(field.value)}
									open={isPopoverOpen}
									onOpenChange={() => setIsPopoverOpen(!isPopoverOpen)}>
									<DatePicker
										selected={field.value}
										setSelected={field.onChange}
										setIsPopoverOpen={setIsPopoverOpen}
									/>
								</Popover>
							)}
						/>

						<div className="border-[0.5px] border-border-subtle"></div>

						<div className="flex items-center justify-between">
							<Button
								type="button"
								variant="secondary"
								onClick={() => setIsFormOpen(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending}>
								{mode === "add" ? "Save loan" : "Save changes"}
							</Button>
						</div>
				</form>
			</Card>
		</div>
	);
}

export default LoanForm;
