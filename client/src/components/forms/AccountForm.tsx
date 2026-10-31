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
			createAccount(data, {
				onSuccess: () => {
					onClose();
				},
			});
		} else {
			if (!account) return null;
			editAccount(
				{ params: { id: account.id }, data },
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
							label="Account name"
							type={"text"}
							error={errors.name?.message}
							{...register("name")}
						/>
						<Input
							label="Account number"
							type={"text"}
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
						<div className="border-[0.5px] border-border-subtle"></div>

						<div className="flex items-center justify-between">
							<Button
								type="button"
								variant="secondary"
								onClick={onClose}>
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
