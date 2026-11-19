import CategoryList from "@/components/features/profile/CategoryList";
import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import Modal from "@/components/primitives/Modal";
import PageHeader from "@/components/primitives/PageHeader";
import { Switch } from "@/components/primitives/Switch";
import ErrorState from "@/components/state/ErrorState";
import LoadingState from "@/components/state/LoadingState";
import { useTheme } from "@/context/ThemeContext";
import { useGetCategories } from "@/hooks/categories";
import { useDeleteUser, useGetUser, useLogout } from "@/hooks/user";
import { getInitials } from "@/lib/helpers";
import { useState } from "react";

// Show the format the way it looks, not the stored enum name.
const DATE_FORMAT_LABELS = {
	dd_MM_yyyy: "31/10/2026",
	MM_dd_yyyy: "10/31/2026",
	yyyy_MM_dd: "2026-10-31",
} as const;

function Profile() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { toggleTheme, theme } = useTheme();
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
			{/* Who you are, with sign out next to it: one compact row across the page. */}
			<Card className="flex flex-wrap items-center gap-4">
				<div className="shrink-0 rounded-full size-14 bg-interactive-primary flex items-center justify-center text-h4 text-interactive-primary-foreground">
					{getInitials(user?.fullName!)}
				</div>
				<div className="grid gap-1 min-w-0 flex-1">
					<p className="text-text-primary text-h4 wrap-break-word">
						{user?.fullName}
					</p>
					<p
						className="text-label-md text-text-secondary truncate"
						title={user?.email}>
						{user?.email}
					</p>
				</div>
				<Button
					type="button"
					variant="secondary"
					className="w-full sm:w-auto"
					onClick={() => logout()}
					disabled={loggingOut}>
					{loggingOut ? "Signing out…" : "Sign out"}
				</Button>
			</Card>

			{/* items-start: each card keeps its own height instead of stretching to
			    match the taller one next to it. */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
				<Card className="grid gap-4">
					<h4 className="text-h4 text-text-primary">Preferences</h4>
					<dl className="grid">
						{[
							["Currency", user?.currency],
							["Date format", user?.dateFormat ? DATE_FORMAT_LABELS[user.dateFormat] : ""],
							["Week start", user?.weekStart === "sun" ? "Sunday" : "Monday"],
							["Language", user?.language === "en" ? "English" : "Arabic"],
						].map(([label, value]) => (
							<div
								key={label}
								className="flex items-center justify-between gap-4 py-2.5 border-b border-border-subtle">
								<dt className="text-text-primary text-body-md">{label}</dt>
								<dd className="text-body-sm text-text-secondary">{value}</dd>
							</div>
						))}
						<div className="flex items-center justify-between gap-4 pt-2.5">
							<dt className="text-text-primary text-body-md">Theme</dt>
							<dd className="flex items-center gap-2">
								<span className="text-label-sm text-text-secondary">Light</span>
								<Switch
									checked={theme === "dark"}
									onCheckedChange={toggleTheme}
									aria-label="Dark mode"
								/>
								<span className="text-label-sm text-text-secondary">Dark</span>
							</dd>
						</div>
					</dl>
				</Card>
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
			</div>

			{/* The dangerous action on its own, at the bottom, text and button in one row. */}
			<Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-status-danger border-status-danger">
				<div className="grid gap-1">
					<p className="text-label-lg text-status-danger-fg">Delete account</p>
					<p className="text-caption-md text-status-danger-fg">
						Removes your accounts, imported transactions, liabilities and
						holdings. This can't be undone.
					</p>
				</div>
				<Button
					type="button"
					variant="destructive"
					className="shrink-0 w-full sm:w-auto"
					onClick={() => setIsDialogOpen(true)}>
					Delete my account
				</Button>
			</Card>
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
