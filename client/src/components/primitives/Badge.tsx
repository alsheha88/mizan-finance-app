import {
	OTHER_BADGE,
	paletteColors,
	UNCATEGORISED_BADGE,
	type PaletteColor,
} from "../../lib/paletteColors";
import { cn } from "../../lib/cn";
import type { HTMLAttributes } from "react";

interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
	color: PaletteColor | "other" | null;
}
function Badge({ children, color, className, ...props }: BadgeProps) {
	return (
		<span
			className={cn(
				color === null
					? UNCATEGORISED_BADGE
					: color === "other"
						? OTHER_BADGE
						: paletteColors[color].badge,
				"px-2.5 py-1 w-max rounded-sm inline-flex text-label-sm",
				className,
			)}
			{...props}>
			{children}
		</span>
	);
}

export default Badge;
