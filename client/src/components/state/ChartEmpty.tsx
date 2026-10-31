import type { ReactNode } from "react";

type ChartEmptyProps = {
	icon?: ReactNode;
	title: string;
	message?: string;
};

/**
 * Small, in-card empty state. Unlike EmptyState this is sized to sit inside a
 * chart card rather than take over a page.
 */
function ChartEmpty({ icon, title, message }: ChartEmptyProps) {
	return (
		<div className="grid gap-2 place-items-center text-center py-12">
			{icon}
			<p className="text-body-md text-text-primary">{title}</p>
			{message && (
				<p className="text-caption-md text-text-tertiary">{message}</p>
			)}
		</div>
	);
}

export default ChartEmpty;
