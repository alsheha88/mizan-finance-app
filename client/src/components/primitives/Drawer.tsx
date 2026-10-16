import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type DrawerProps = {
	title: string;
	subtitle?: string;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onAction?: () => void;
	footer?: ReactNode;
	children: ReactNode;
};

export function Drawer({
	title,
	subtitle,
	isOpen,
	onOpenChange,
	onAction,
	footer,
	children,
}: DrawerProps) {
	const id = useId();
	const panelRef = useRef<HTMLDivElement>(null);
	const previouslyFocusedRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!isOpen) return;

		previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

		const panel = panelRef.current;
		panel?.focus();
		document.body.style.overflow = "hidden";

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onOpenChange(false);
				return;
			}

			if (e.key !== "Tab" || !panel) return;

			const focusable = Array.from(
				panel.querySelectorAll<HTMLElement>(FOCUSABLE),
			).filter((el) => el.offsetParent !== null);

			if (focusable.length === 0) {
				e.preventDefault();
				return;
			}

			const first = focusable[0]!;
			const last = focusable[focusable.length - 1]!;
			const active = document.activeElement;

			if (e.shiftKey && (active === first || active === panel)) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && active === last) {
				e.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
			previouslyFocusedRef.current?.focus();
		};
	}, [isOpen, onOpenChange]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black/30"
			onClick={() => onOpenChange(false)}
		>
			<div
				ref={panelRef}
				tabIndex={-1}
				role="dialog"
				aria-modal="true"
				aria-labelledby={id}
				onClick={(e) => e.stopPropagation()}
				className="fixed right-0 top-0 h-dvh w-sm flex flex-col bg-popover-default"
			>
				<div className="p-6 flex items-center justify-between border-b border-b-border-default">
					<div className="flex flex-col gap-1">
						<h3 id={id} className="text-h3 text-text-primary">
							{title}
						</h3>
						{subtitle && (
							<p className="text-caption-md text-text-secondary">{subtitle}</p>
						)}
					</div>
					<Button
						className="hover:bg-transparent active:bg-transparent"
						variant="ghost"
						aria-label="Close"
						onClick={() => onOpenChange(false)}
					>
						<X className="text-text-secondary" />
					</Button>
				</div>

				<div className="p-6 grid gap-4 flex-1 overflow-y-auto">{children}</div>

				<div className="p-6 border-t border-t-border-default">
					{footer ?? (
						<div className="grid grid-cols-2 gap-2">
							<Button variant="secondary" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button onClick={onAction}>Save</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}