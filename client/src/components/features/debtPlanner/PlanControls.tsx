import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import { Input } from "@/components/primitives/Input";
import NoticeCard from "@/components/primitives/NoticeCard";
import { useEditUser } from "@/hooks/user";
import { toSafeExtra } from "@/lib/helpers";

type PlanControlsProps = {
	extraText: string;
	setExtraText: (value: string) => void;
	savedExtra: number;
};

function PlanControls({ extraText, setExtraText, savedExtra }: PlanControlsProps) {
	const { mutate, isPending } = useEditUser();
	const currentExtra = toSafeExtra(extraText);
	const isSaved = currentExtra === savedExtra;

	return (
		<Card className="grid gap-6">
			<div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-6 xl:gap-8">
				<div className="flex flex-col sm:flex-row sm:items-end gap-2">
					<Input
						type={"text"}
						inputMode="decimal"
						label="Extra payment per month"
						startIcon={<span className="text-body-sm">KWD</span>}
						className="ps-14"
						wrapperClassName="flex-1"
						value={extraText}
						onChange={(e) => setExtraText(e.target.value)}
					/>
					<Button
						type="button"
						className="w-full sm:w-auto shrink-0 whitespace-nowrap py-2.5 border border-transparent"
						disabled={isSaved || isPending}
						onClick={() => mutate({ debtPlannerExtra: currentExtra })}>
						{isSaved ? "Saved" : "Save my plan"}
					</Button>
				</div>
				<div className="flex flex-col gap-1.5">
					<p className="text-text-primary text-label-lg">How it works</p>
					<p className="text-text-secondary text-body-sm">
						Pay the minimum on every debt and put the extra on the smallest
						balance. When it's paid off, its payment rolls into the next one.
						The plan assumes no new spending on these cards.
					</p>
				</div>
			</div>
			<NoticeCard
				message="For Islamic financing, paying early only lowers the total if KFH gives an early-settlement discount. Check with the bank before you pay extra on a financing contract."
				noticeType="info"
			/>
		</Card>
	);
}

export default PlanControls;
