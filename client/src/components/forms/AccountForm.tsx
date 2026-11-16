import { useEffect } from "react";
import { Card } from "../primitives/Card";
import { Input } from "../primitives/Input";
import { Select } from "../primitives/Select";
import { Button } from "../primitives/Button";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import {
	createAccountSchema,
	type Account,
	type CreateAccountData,
} from "@/schema/accountsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateAccount, useEditAccount } from "@/hooks/accounts";
import { ACCOUNT_TYPE_LABELS, toOptions } from "@/lib/labels";

const toFormValues = (account: Account | null): CreateAccountData => ({
	name: account?.name ?? "",
	accountNumber: account?.accountNumber ?? "",
	accountType: account?.accountType ?? "cash",
});

type AccountFormProps = {
	mode: "add" | "edit";
	onClose: () => void;
	account: Account | null;
};

function AccountForm({ mode, onClose, account }: AccountFormProps) {
	const { mutate: createAccount, isPending: isCreating } = useCreateAccount();
	const { mutate: editAccount, isPending: isEditing } = useEditAccount();
	const header = mode === "add" ? "Add account" : "Edit account";

	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm<CreateAccountData>({
		resolver: zodResolver(createAccountSchema),
		defaultValues: toFormValues(account),
	});

	useEffect(() => {
		reset(toFormValues(account));
	}, [account, reset]);

	const onSubmit: SubmitHandler<CreateAccountData> = (data) => {
		if (mode === "add") {
			createAccount(data, { onSuccess: onClose });
		} else {
			if (!account) return;
			editAccount({ params: { id: account.id }, data }, { onSuccess: onClose });
		}
	};

	return (
		<div className="fixed inset-0 z-50 bg-surface-overlay flex items-center justify-center p-4">
			<Card className="grid gap-6 w-full max-w-lg max-h-[90dvh] overflow-y-auto">
				<h3 className="text-h3 text-text-primary">{header}</h3>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="sm:col-span-2">
						<Input
							label="Account name"
							type={"text"}
							placeholder="e.g. Salary account"
							error={errors.name?.message}
							{...register("name")}
						/>
					</div>
					<Input
						label="Account number"
						type={"text"}
						inputMode="numeric"
						maxLength={12}
						placeholder="12 digits"
						error={errors.accountNumber?.message}
						{...register("accountNumber")}
					/>
					<Controller
						name="accountType"
						control={control}
						render={({ field }) => (
							<Select
								label={"Account type"}
								options={toOptions(ACCOUNT_TYPE_LABELS)}
								value={field.value}
								onValueChange={field.onChange}
								placeholder={"Select type"}
								error={errors.accountType?.message}
							/>
						)}
					/>

					<div className="flex items-center justify-between sm:col-span-2">
						<Button type="button" variant="secondary" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={isCreating || isEditing}>
							{mode === "add" ? "Save account" : "Save changes"}
						</Button>
					</div>
				</form>
			</Card>
		</div>
	);
}

export default AccountForm;