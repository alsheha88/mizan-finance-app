import { Button } from "./Button";

type FilterChipsProps = {
	options: { id: string; label: string }[];
	value: string;
	onChange: (id: string) => void;
};

export function FilterChips({ options, value, onChange }: FilterChipsProps) {
	return (
		<div className="flex items-center gap-2">
			{options.map((o) => (
				<Button
					variant="secondary"
					key={o.id}
					aria-pressed={value === o.id}
					onClick={() => onChange(o.id)}
					className="px-3 py-2 aria-pressed:border-border-focus aria-pressed:text-accent-foreground aria-pressed:bg-accent-default">
					{o.label}
				</Button>
			))}
		</div>
	);
}
