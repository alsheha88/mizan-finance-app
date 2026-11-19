import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type IconButtonProps = {
	// Required: an icon alone says nothing to a screen reader. Also shown on hover.
	label: string;
	icon: ReactNode;
	tone?: "default" | "destructive";
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

// A small outlined square button with one icon, for secondary card actions
// (edit, delete) that shouldn't compete with the card's main button.
export function IconButton({
	label,
	icon,
	tone = "default",
	className,
	type = "button",
	...props
}: IconButtonProps) {
	return (
		<button
			type={type}
			aria-label={label}
			title={label}
			className={cn(
				"shrink-0 inline-flex items-center justify-center size-9 rounded-sm border border-border-default cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed",
				tone === "destructive"
					? "text-interactive-destructive hover:bg-status-danger focus-visible:ring-ring-destructive"
					: "text-text-secondary hover:bg-interactive-ghost-hover hover:text-text-primary focus-visible:ring-ring-default",
				className,
			)}
			{...props}>
			{icon}
		</button>
	);
}
