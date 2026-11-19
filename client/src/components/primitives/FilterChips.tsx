import { useEffect, useRef } from "react";
import { Button } from "./Button";

type FilterChipsProps = {
	options: { id: string; label: string }[];
	value: string | undefined;
	onChange: (id: string) => void;
};

export function FilterChips({ options, value, onChange }: FilterChipsProps) {
	const listRef = useRef<HTMLDivElement>(null);

	// On phones the chips are one sideways-scrolling row; keep the selected chip
	// in view (e.g. "Uncategorised" at the far end).
	useEffect(() => {
		listRef.current
			?.querySelector('[aria-pressed="true"]')
			?.scrollIntoView({ block: "nearest", inline: "nearest" });
	}, [value]);

	return (
		<div
			ref={listRef}
			// Phones: one row that scrolls sideways, edge to edge (-mx-6/px-6 undo the
			// page padding), instead of five rows of chips above the data.
			// From sm: wrap onto several rows as before.
			className="flex items-center gap-2 overflow-x-auto -mx-6 px-6 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:mx-0 sm:px-0">
			{options.map((o) => (
				<Button
					variant="secondary"
					key={o.id}
					aria-pressed={value === o.id}
					onClick={() => onChange(o.id)}
					className="shrink-0 whitespace-nowrap px-3 py-2 rounded-full text-text-secondary aria-pressed:border-border-focus aria-pressed:text-accent-foreground aria-pressed:bg-accent-default">
					{o.label}
				</Button>
			))}
		</div>
	);
}
