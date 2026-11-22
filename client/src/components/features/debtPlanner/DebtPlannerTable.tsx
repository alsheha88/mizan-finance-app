import Badge from "@/components/primitives/Badge";
import { Card } from "@/components/primitives/Card";
import { Table, TCell, TH, THead, TRow } from "@/components/primitives/Table";
import { useMediaQuery } from "@/hooks/custom/mediaQuery";
import {  formatKWD, monthsFromNow } from "@/lib/helpers";
import type { DebtPlanResponse } from "@/schema/debtPlannerSchema";

type DebtPlannerTableProps = {
	order: DebtPlanResponse["order"];
};
const debtType = { card: "Credit card", loan: "Loan" };

function DebtPlannerTable({ order }: DebtPlannerTableProps) {
	const isDesktop = useMediaQuery("(min-width: 64rem)");

	return (
		<>
			{isDesktop ? (
				<div className="min-w-0">
					<Table>
						<THead>
							<TRow>
								<TH>Debt</TH>
								<TH>Balance</TH>
								{/* <TH>Monthly payment</TH> */}
								<TH>Paid off</TH>
								<TH className="text-end">Status</TH>
							</TRow>
						</THead>
						<tbody>
							{order.map((o, i) => (
								<TRow key={o.id}>
									<TCell className="whitespace-nowrap">
										{o.name}
										<p className="text-body-sm text-text-tertiary line-clamp-1">
											{debtType[o.kind]}
										</p>
									</TCell>
									<TCell>{formatKWD(o.balance)}</TCell>
									<TCell>
										{o.payoffMonth === null
											? "Not within 50 years"
											: monthsFromNow(o.payoffMonth)}
									</TCell>
									<TCell className="whitespace-nowrap text-end">
										<Badge color={i === 0 ? "mint" : "amber"}>
											{i === 0 ? "Focus now" : "Waiting"}
										</Badge>
									</TCell>
								</TRow>
							))}
						</tbody>
					</Table>
				</div>
			) : (
				<div className="grid gap-3">
					{order.map((o, i) => (
						<Card key={o.id} className="grid gap-3">
							<div className="flex items-start justify-between gap-3">
								<div className="flex flex-col gap-1 min-w-0">{o.name}</div>
								<p className="text-body-sm text-text-primary whitespace-nowrap tabular-nums">
									{formatKWD(o.balance)}
								</p>
							</div>
							<div className="flex items-center justify-between gap-3 flex-wrap">
								<div className="flex items-center gap-2 text-caption-sm text-text-tertiary">
									<span>{debtType[o.kind]}</span>
									<span aria-hidden="true">·</span>
									<span>
										{o.payoffMonth === null
											? "Not within 50 years"
											: monthsFromNow(o.payoffMonth)}
									</span>
								</div>
								<Badge color={i === 0 ? "mint" : "amber"}>
									{i === 0 ? "Focus now" : "Waiting"}
								</Badge>
							</div>
						</Card>
					))}
				</div>
			)}
		</>
	);
}

export default DebtPlannerTable;
