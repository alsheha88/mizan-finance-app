import { Card } from "@/components/primitives/Card";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type StatCardProps = {
	title: string;
	subTitle?: string | number;
	className?: string;
	children?: ReactNode;
};

// Amounts without the currency, which is shown separately in smaller text.
const amountFormat = new Intl.NumberFormat("en-KW", {
	minimumFractionDigits: 3,
	maximumFractionDigits: 3,
});

function StatCard({ title, subTitle, className, children }: StatCardProps) {
	return (
		<Card className={cn("flex flex-col gap-2 min-w-0 p-4 sm:p-5", className)}>
			<p className="text-label-md text-text-secondary">{title}</p>
			{typeof subTitle === "number" ? (
				// "KWD" small and the number large: the number is what people read,
				// and two of these side by side still fit on a phone.
				<p className="flex flex-wrap items-baseline gap-x-1.5 text-text-primary">
					<span className="text-label-md text-text-tertiary">KWD</span>
					<span className="text-h3 sm:text-h2 tabular-nums">
						{amountFormat.format(subTitle)}
					</span>
				</p>
			) : (
				<p className="text-h3 sm:text-h2 text-text-primary tabular-nums wrap-break-word">
					{subTitle}
				</p>
			)}
			{children}
		</Card>
	);
}

export default StatCard;
