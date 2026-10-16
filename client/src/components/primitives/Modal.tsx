import type { ReactNode } from "react";
import { Button } from "./Button";
import * as Dialog from "radix-ui/dialog";

type ModalProps = {
	trigger?: ReactNode;
	title: string;
	content: string;
	item?: string;
	btnContent: string;
	variant: "destructive" | "primary";
	onConfirm: () => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

function Modal({
	trigger,
	title,
	item,
	content,
	btnContent,
	variant,
	onConfirm,
	open,
	onOpenChange,
}: ModalProps) {
	return (
		<Dialog.Root onOpenChange={onOpenChange} open={open}>
			{trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
				<Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 grid gap-3 p-6 rounded-lg bg-popover-default border border-border-default">
					<Dialog.Title className="text-h3 text-text-primary">
						{title} {item}
					</Dialog.Title>
					<Dialog.Description className="text-text-secondary text-body-sm">
						{content}
					</Dialog.Description>
					<div className="place-self-end flex items-center gap-3">
						<Dialog.Close asChild>
							<Button variant="ghost">Cancel</Button>
						</Dialog.Close>
						<Button variant={variant} onClick={onConfirm}>
							{btnContent}
						</Button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export default Modal;
