import { Button } from "@/components/primitives/Button";
import { Table, TCell, TH, THead, TRow } from "@/components/primitives/Table";
import { formatDate, formatKWD } from "@/lib/helpers";
import { TriangleAlert } from "lucide-react";

type UploadPreviewProps = {
	transactions: {
		id: string;
		merchant: string;
		amount: string;
		transactionDate: string;
	}[];
	onClose: () => void;
	skipped?: number;
};

function UploadPreview({ transactions, onClose, skipped }: UploadPreviewProps) {
	return (
		<div className="grid gap-4 p-6 border-b border-b-border-subtle overflow-y-auto scrollbar-track-transparent scrollbar-thumb-accent-foreground scrollbar-gutter-stable">
			{skipped !== undefined && skipped > 0 && (
				<div className="grid place-items-center gap-3 px-8 py-10 bg-input-background border border-border-default rounded-lg">
					<TriangleAlert className="w-10 h-10 stroke-interactive-primary stroke-1" />
					<p className="text-body-md text-text-primary text-center">
						This statement has already been uploaded. If you have a new
						statement for this account please try to upload again
					</p>
				</div>
			)} 
			{transactions.length > 0 && (
				<Table className="">
					<THead>
						<TRow>
							<TH>Date</TH>
							<TH>Merchant</TH>
							<TH className="text-center">Amount</TH>
						</TRow>
					</THead>
					<tbody>
						{transactions.map((t) => (
							<TRow key={t.id}>
								<TCell>{formatDate(t.transactionDate)}</TCell>
								<TCell>{t.merchant}</TCell>
								<TCell className="text-center">
									{formatKWD(Number(t.amount))}
								</TCell>
							</TRow>
						))}
					</tbody>
				</Table>
			)}
			<div className="place-self-end">
				<Button type="button" onClick={onClose}>
					Done
				</Button>
			</div>
		</div>
	);
}

export default UploadPreview;
