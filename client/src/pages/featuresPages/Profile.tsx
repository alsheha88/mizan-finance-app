import CategoryList from "@/components/features/profile/CategoryList";
import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import Modal from "@/components/primitives/Modal";
import PageHeader from "@/components/primitives/PageHeader";
import ErrorState from "@/components/state/ErrorState";
import LoadingState from "@/components/state/LoadingState";
import { useGetCategories } from "@/hooks/categories";
import { useDeleteUser, useGetUser, useLogout } from "@/hooks/user";
import { getInitials } from "@/lib/helpers";
import { useState } from "react";

function Profile() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { mutate: deleteUser, isPending: deletingUser } = useDeleteUser();
	const { mutate: logout, isPending: loggingOut } = useLogout();

	const { data: user, isError, isPending, refetch } = useGetUser();
	const { data: categories } = useGetCategories();

	if (isPending) return <LoadingState />;
	if (isError)
		return (
			<ErrorState
				title={"Something Went Wrong!"}
				message={"We couldn't load your info, please try again"}
				onAction={refetch}
			/>
		);

	const onDelete = () => deleteUser();

	return (
		<div className="flex flex-col gap-8 min-h-dvh">
			<PageHeader title="Profile" subTitle="Manage your account" />
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Card className="grid gap-4">
					<h4 className="text-h4 text-text-primary">Account</h4>
					<div className="flex gap-4">
						<div className="rounded-full w-14 h-14 bg-interactive-primary flex items-center justify-center text-h4 text-interactive-primary-foreground">
							{getInitials(user?.fullName!)}
						</div>
						<div className="grid gap-1">
							<p className="text-text-primary text-h4">{user?.fullName}</p>
							<p className="text-label-md text-text-secondary">{user?.email}</p>
						</div>
					</div>
				</Card>
				<Card className="grid gap-4">
					<h4 className="text-h4 text-text-primary">Preferences</h4>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="flex items-center justify-between">
							<p className="text-text-primary text-body-md">Currency</p>
							<p className="text-label-sm text-text-secondary">
								{user?.currency}
							</p>
						</div>
						<div className="flex items-center justify-between">
							<p className="text-text-primary text-body-md">Date format</p>
							<p className="text-label-sm text-text-secondary">
								{user?.dateFormat}
							</p>
						</div>
						<div className="flex items-center justify-between">
							<p className="text-text-primary text-body-md">Week start</p>
							<p className="text-label-sm text-text-secondary">
								{user?.weekStart === "sun" ? "Sunday" : "Monday"}
							</p>
						</div>
						<div className="flex items-center justify-between">
							<p className="text-text-primary text-body-md">Language</p>
							<p className="text-label-sm text-text-secondary">
								{user?.language === "en" ? "English" : "Arabic"}
							</p>
						</div>
					</div>
				</Card>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Card className="grid gap-5">
					<div className="flex flex-col gap-1">
						<h4 className="text-text-primary text-h4">Categories</h4>
						<p className="text-text-tertiary text-caption-md">
							Income and expense categories are separate lists.
						</p>
					</div>
					<CategoryList
						title="Income"
						appliesTo="income"
						categories={
							categories?.filter((c) => c.appliesTo === "income") ?? []
						}
					/>
					<CategoryList
						title="Expenses"
						appliesTo="expense"
						categories={
							categories?.filter((c) => c.appliesTo === "expense") ?? []
						}
					/>
				</Card>
				<Card className="grid gap-5">
					<h4 className="text-h4 text-text-primary">Data & account</h4>
					<Button
						type="button"
						variant="secondary"
						onClick={() => logout()}
						disabled={loggingOut}>
						{loggingOut ? "Logging out" : "Sign out"}
					</Button>
					<div className="grid gap-3 p-4 bg-status-danger rounded-md">
						<p className="text-label-lg text-status-danger-fg">
							Delete account
						</p>
						<p className="text-caption-md text-status-danger-fg">
							Removes your accounts, imported transactions, liabilities and
							holdings. This can't be undone.
						</p>
						<Button
							type="button"
							variant="destructive"
							onClick={() => setIsDialogOpen(true)}>
							Delete my account
						</Button>
					</div>
				</Card>
			</div>
			<Modal
				title={"Delete"}
				content={"Are you sure you want to delete your account?"}
				btnContent={"Delete account"}
				variant={"destructive"}
				onConfirm={onDelete}
				isPending={deletingUser}
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}></Modal>
		</div>
	);
}

export default Profile;
