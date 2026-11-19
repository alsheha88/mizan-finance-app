import * as DropdownMenu from "radix-ui/dropdown-menu";
import type { ReactNode } from "react";

type DropdownProps = {
	trigger: ReactNode;
	children: ReactNode;
    align?: "end" | "start";
    sideOffset?:number
};

function DropdownMenuComponent({ trigger, children, align = "end", sideOffset = 4 }: DropdownProps) {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					sideOffset={sideOffset}
					align={align}
					className="p-1 flex flex-col min-w-64 z-50 bg-bg-elevated text-text-primary border border-border-default rounded-md shadow-overlay">
					{children}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}

export default DropdownMenuComponent;
