import { Button } from "@/components/primitives/Button";
import { Table, TCell, TH, THead, TRow } from "@/components/primitives/Table";
import { formatDate, formatKWD, handleSingular } from "@/lib/helpers";
import { CircleCheck } from "lucide-react";
import { UploadBox, UploadStateLayout } from "./UploadStateLayout";

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

function UploadPreview({ transactions, onClose, skipped = 0 }: UploadPreviewProps) {
	const imported = transactions.length;
	const allSkipped = imported === 0 && skipped > 0;

	return (
		<UploadStateLayout
			footer={
				<Button type="button" onClick={onClose}>
					Done
				</Button>
			}>
			{allSkipped ? (
				<UploadBox>
					<CircleCheck className="size-10 stroke-text-tertiary stroke-1" aria-hidden />
					<h4 className="text-h4 text-text-primary">Already imported</h4>
					<p className="text-body-sm text-text-secondary">
						Every transaction in this statement was imported before. Nothing new
						was added.
					</p>
				</UploadBox>
			) : (
				<>
					<p className="text-body-sm text-text-secondary">
						Imported {imported} new {handleSingular(imported)}
						{skipped > 0 && `. Skipped ${skipped} already imported`}.
					</p>
					{imported > 0 && (
						<Table>
							<THead>
								<TRow>
									<TH>Date</TH>
									<TH>Merchant</TH>
									<TH className="text-end">Amount</TH>
								</TRow>
							</THead>
							<tbody>
								{transactions.map((t) => (
									<TRow key={t.id}>
										<TCell className="whitespace-nowrap">
											{formatDate(t.transactionDate)}
										</TCell>
										<TCell>{t.merchant}</TCell>
										<TCell className="text-end whitespace-nowrap tabular-nums">
											{formatKWD(Number(t.amount))}
										</TCell>
									</TRow>
								))}
							</tbody>
						</Table>
					)}
				</>
			)}
		</UploadStateLayout>
	);
}

export default UploadPreview;