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
					className="p-2 flex flex-col min-w-64 bg-popover-default border text-text-primary border-border-default rounded-sm z-50">
					{children}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}

export default DropdownMenuComponent;
