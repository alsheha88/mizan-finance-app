// Popover.tsx
import * as RadixPopover from "radix-ui/popover";
import type { ReactNode } from "react";

type PopoverProps = {
	children: ReactNode;
	triggerContent: ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function Popover({
	triggerContent,
	children,
	open,
	onOpenChange,
}: PopoverProps) {
	return (
		<RadixPopover.Root open={open} onOpenChange={onOpenChange}>
			<RadixPopover.Trigger className="flex items-center gap-1.5 bg-input-background p-3 border border-border-default rounded-sm text-text-primary text-body-sm cursor-pointer focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-border-focus data-[state=open]:border-border-focus">
				{triggerContent}
			</RadixPopover.Trigger>

			<RadixPopover.Portal>
				<RadixPopover.Content
					sideOffset={4}
					side="bottom"
					className="w-(--radix-popover-trigger-width) z-50"
				>
					{children}
				</RadixPopover.Content>
			</RadixPopover.Portal>
		</RadixPopover.Root>
	);
}