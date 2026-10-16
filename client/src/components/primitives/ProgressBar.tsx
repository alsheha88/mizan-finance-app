import { cn } from "@/lib/cn";
import { paletteColors, type PaletteColor } from "@/lib/paletteColors";
import type { HTMLAttributes } from "react";

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
	progress: number;
	color: PaletteColor;
	label: string;
}

export function ProgressBar({
	progress,
	color,
	label,
	className,
	...props
}: ProgressBarProps) {
	const value = Math.max(0, Math.min(progress, 100));

	return (
		<div
			className={cn("h-1.5 w-full rounded-full bg-surface-active", className)}
			role="progressbar"
			aria-label={label}
			aria-valuenow={value}
			aria-valuemin={0}
			aria-valuemax={100}
			{...props}
		>
			<div
				className={cn(
					paletteColors[color].swatch,
					"h-full rounded-full transition-[width]",
				)}
				style={{ width: `${value}%` }}
			/>
		</div>
	);
}