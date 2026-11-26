import { cn } from "@/lib/cn";

type LogoMarkProps = {
	size?: number;
	className?: string;
};

// The Mizan mark: a balance (ميزان) on the brand-orange tile. Colours come
// from theme tokens, so the mark follows the active theme.
export function LogoMark({ size = 40, className }: LogoMarkProps) {
	return (
		<svg
			viewBox="0 0 64 64"
			width={size}
			height={size}
			fill="none"
			aria-hidden="true"
			className={cn("shrink-0", className)}>
			<rect width="64" height="64" rx="16" className="fill-interactive-primary" />
			<g
				strokeWidth="4"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="stroke-interactive-primary-foreground">
				<path d="M13 23.5 Q32 17 51 23.5" />
				<path d="M32 18 V46" />
				<path d="M24 47 H40" />
				<path d="M15.5 24.5 L10.5 36.5 M15.5 24.5 L20.5 36.5" />
				<path d="M48.5 24.5 L43.5 36.5 M48.5 24.5 L53.5 36.5" />
			</g>
			<g className="fill-interactive-primary-foreground">
				<path d="M9 36.5 H22 A6.5 6.5 0 0 1 9 36.5 Z" />
				<path d="M42 36.5 H55 A6.5 6.5 0 0 1 42 36.5 Z" />
				<rect x="28.5" y="10" width="7" height="7" rx="1.2" transform="rotate(45 32 13.5)" />
			</g>
		</svg>
	);
}

type LogoProps = {
	markSize?: number;
	className?: string;
	textClassName?: string;
};

export function Logo({ markSize = 40, className, textClassName }: LogoProps) {
	return (
		<div className={cn("flex items-center gap-3", className)}>
			<LogoMark size={markSize} />
			<span className={cn("text-h4 text-text-primary", textClassName)}>Mizan</span>
		</div>
	);
}
