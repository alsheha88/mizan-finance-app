import * as Dialog from "radix-ui/dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type FormDialogProps = {
	title: string;
	description?: ReactNode;
	// Called on Escape, the close button, or any Cancel/Done button inside.
	onClose: () => void;
	// false while saving or uploading: Escape and the close button do nothing,
	// so a request can't be abandoned halfway.
	canClose?: boolean;
	// md for forms, lg for wider content like the upload preview table.
	size?: "md" | "lg";
	// true: children sit in a padded area that scrolls when the form is long.
	// false: children handle their own padding and scrolling (the upload states).
	padded?: boolean;
	className?: string;
	children: ReactNode;
};

const sizeClasses = { md: "max-w-lg", lg: "max-w-2xl" } as const;

// The shell for every form and upload dialog. Built on Radix Dialog, which
// handles what the hand-made overlays didn't: focus moves into the dialog and
// stays there, Escape closes it, focus returns to the button that opened it,
// screen readers announce it as a dialog, and the page behind stops scrolling
// without the layout jumping sideways (the scrollbar's space is kept).
//
// Parents render it only while it should be open, so it's always `open` here.
export function FormDialog({
	title,
	description,
	onClose,
	canClose = true,
	size = "md",
	padded = true,
	className,
	children,
}: FormDialogProps) {
	return (
		<Dialog.Root
			open
			onOpenChange={(open) => {
				if (!open && canClose) onClose();
			}}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-surface-overlay" />
				<Dialog.Content
					// A click outside doesn't close it: one stray click shouldn't throw
					// away a half-filled form. Escape and the buttons still close it.
					onInteractOutside={(e) => e.preventDefault()}
					{...(!description && { "aria-describedby": undefined })}
					className={cn(
						"fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-h-[85dvh] flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-card-default text-card-foreground shadow-overlay focus:outline-none",
						sizeClasses[size],
						className,
					)}>
					<div className="shrink-0 flex items-start justify-between gap-4 px-6 py-5 border-b border-border-subtle">
						<div className="grid gap-1 min-w-0">
							<Dialog.Title className="text-h3 text-text-primary">{title}</Dialog.Title>
							{description && (
								<Dialog.Description className="text-caption-md text-text-tertiary">
									{description}
								</Dialog.Description>
							)}
						</div>
						<Dialog.Close
							disabled={!canClose}
							aria-label="Close"
							className="shrink-0 rounded-sm p-1.5 text-text-tertiary cursor-pointer transition-colors hover:bg-interactive-ghost-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-default disabled:cursor-not-allowed disabled:opacity-50">
							<X size={18} aria-hidden />
						</Dialog.Close>
					</div>

					{padded ? (
						<div className="flex-1 min-h-0 overflow-y-auto p-6 scrollbar-track-transparent scrollbar-thumb-border-strong">
							{children}
						</div>
					) : (
						<div className="flex-1 min-h-0 flex flex-col">{children}</div>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
