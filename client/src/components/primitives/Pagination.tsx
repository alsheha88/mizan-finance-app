import { Button } from "./Button";
import { cn } from "@/lib/cn";

type PaginationProps = {
	page: number;
	count: number;
	limit: number;
	onPageChange: (page: number) => void;
};

export function Pagination({
	page,
	limit,
	count,
	onPageChange,
}: PaginationProps) {
	if (count === 0) return null;
	const skip = (page - 1) * limit;
	const totalPages = Math.ceil(count / limit);
	const pages: (number | "...")[] = [];

	const windowed = new Set<number>([1, totalPages]);
	for (let i = page - 1; i <= page + 1; i++) {
		if (i >= 1 && i <= totalPages) windowed.add(i);
	}

	const sorted = [...windowed].sort((a, b) => a - b);

	sorted.forEach((n, i) => {
		const prev = sorted[i - 1];
		if (prev !== undefined && n - prev > 1) pages.push("...");
		pages.push(n);
	});
	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-3">
			<p className="text-caption-lg text-input-placeholder">
				Showing {skip + 1} - {Math.min(skip + limit, count)} of {count}{" "}
				transactions
			</p>
			<div className="flex items-center gap-2 flex-wrap justify-center">
				<Button
					variant="secondary"
					onClick={() => onPageChange(page - 1)}
					disabled={page === 1}>
					Prev
				</Button>
				{pages.map((p, i) =>
					p === "..." ? (
						<span className="text-input-placeholder" key={i}>
							{p}
						</span>
					) : (
						<Button
							key={p}
							variant="secondary"
							onClick={() => onPageChange(p)}
							className={cn(
								p === page &&
									"border-accent-foreground bg-accent-default text-accent-foreground",
							)}>
							{p}
						</Button>
					),
				)}

				<Button
					variant="secondary"
					onClick={() => onPageChange(page + 1)}
					disabled={page === totalPages}>
					Next
				</Button>
			</div>
		</div>
	);
}
