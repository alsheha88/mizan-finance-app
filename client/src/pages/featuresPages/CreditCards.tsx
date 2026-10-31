import CardTransactionsTable from "@/components/features/cards/CardTransactionsTable";
import CreditCardComponent from "@/components/features/cards/CreditCardComponent";
import UploadCardStatementModal from "@/components/features/cards/UploadCardStatementModal";
import StatCard from "@/components/features/shared/StatCard";
import CardForm from "@/components/forms/CardForm";
import { Button } from "@/components/primitives/Button";
import PageHeader from "@/components/primitives/PageHeader";
import { Select } from "@/components/primitives/Select";
import EmptyState from "@/components/state/EmptyState";
import ErrorState from "@/components/state/ErrorState";
import LoadingState from "@/components/state/LoadingState";
import { useGetCards } from "@/hooks/cards";
import { useGetCardTransactions } from "@/hooks/transactions";
import { useTransactionsFilters } from "@/hooks/transactionsFilters";
import { formatKWD, getDateRange } from "@/lib/helpers";
import type { CreditCard } from "@/schema/creditCardsSchema";
import { Calendar, CreditCardIcon } from "lucide-react";
import { useState } from "react";

type CardFormState = {
	mode: "add" | "edit";
	card: CreditCard | null;
};

function CreditCards() {
	const { month, page, search, categoryId, limit, onMonthChange } =
		useTransactionsFilters();
	const [formState, setFormState] = useState<CardFormState | null>(null);
	const [uploadCard, setUploadCard] = useState<CreditCard | null>(null);
	const { data: cards, isError, isPending, refetch } = useGetCards();
	const { data: cardTransactions } = useGetCardTransactions({
		month,
		page,
		search,
		categoryId,
		limit,
	});

	if (isPending) return <LoadingState />;
	if (isError)
		return (
			<ErrorState
				title={"Something Went Wrong!"}
				message={"We couldn't load your accounts please try again"}
				onAction={refetch}
			/>
		);

	const totalOutstanding = cards
		.map((i) => Number(i.outstandingBalance))
		.reduce((acc, b) => acc + b, 0);
	const totalLimit = cards
		.map((i) => Number(i.limit))
		.reduce((acc, b) => acc + b, 0);
	const utilization =
		totalLimit > 0 ? (totalOutstanding / totalLimit) * 100 : 0;

	const monthOptions = getDateRange().map((i) => {
		return {
			label: i,
			value: i,
		};
	});

	return (
		<div className="flex flex-col gap-8 min-h-dvh">
			<PageHeader title="Credit Cards" subTitle="Credit cards you're carrying.">
				<Button
					type="button"
					onClick={() => {
						setFormState({ mode: "add", card: null });
					}}>
					Add card
				</Button>
				{cards.length > 0 && (
					<Select
						options={monthOptions}
						placeholder={"Select a period"}
						value={month}
						onValueChange={onMonthChange}
						startIcon={<Calendar className="stroke-text-tertiary" size={16} />}
						showChevron={false}
						ariaLabel="Select month"
						className="w-full sm:w-auto sm:min-w-3xs"
					/>
				)}
			</PageHeader>
			{cards.length === 0 ? (
				<EmptyState
					icon={
						<CreditCardIcon
							className="stroke-interactive-primary stroke-1"
							size={56}
						/>
					}
					title={"No cards found"}
					message={
						"You have no linked cards, please create a card by clicking the add card button"
					}></EmptyState>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<StatCard
							title={"Total Outstanding"}
							subTitle={formatKWD(totalOutstanding)}></StatCard>
						<StatCard
							title={"Utilization"}
							subTitle={`${utilization.toFixed(1)}%`}></StatCard>
						<StatCard
							title={"Number of cards owned"}
							subTitle={cards.length.toString()}></StatCard>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{cards.map((i) => (
							<CreditCardComponent
								key={i.id}
								card={i}
								onUpload={setUploadCard}
								onEdit={(card) => setFormState({ mode: "edit", card })}
							/>
						))}
					</div>
				</>
			)}
			{cardTransactions && cards.length > 0 && (
				<div className="grid gap-4">
					<PageHeader title={"Card Transactions"} as="h2" />
					<CardTransactionsTable transactions={cardTransactions.transactions} />
				</div>
			)}

			{formState && (
				<CardForm
					mode={formState.mode}
					onClose={() => setFormState(null)}
					card={formState.card}
				/>
			)}

			{uploadCard && (
				<UploadCardStatementModal
					card={uploadCard}
					onClose={() => setUploadCard(null)}
				/>
			)}
		</div>
	);
}

export default CreditCards;
