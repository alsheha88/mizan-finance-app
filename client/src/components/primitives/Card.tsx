import { cn } from "../../lib/cn";
import { type HTMLAttributes, type Ref } from "react";

const sizeClasses = {
	sm: "p-3",
	md: "p-4",
	lg: "p-5",
	xl: "p-6",
} as const;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	size?: keyof typeof sizeClasses;
	interactive?: boolean;
	ref?: Ref<HTMLDivElement>;
}

export function Card({
	className,
	size = "lg",
	interactive = false,
	ref,
	...props
}: CardProps) {
	return (
		<div
			ref={ref}
			className={cn(
				"relative shadow-card border border-border-subtle bg-card-default text-card-foreground rounded-lg",
				interactive &&
					"transition-colors cursor-pointer hover:bg-card-hover focus-within:ring-2 focus-within:ring-ring-default",
				sizeClasses[size],
				className,
			)}
			{...props}
		/>
	);
}