import * as RadixSwitch from "radix-ui/switch";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// A generic on/off switch. Takes Radix's own props (checked, onCheckedChange,
// aria-label, disabled…), so it works for any setting, not only the theme.
type SwitchProps = ComponentProps<typeof RadixSwitch.Root>;

export function Switch({ className, ...props }: SwitchProps) {
	return (
		<RadixSwitch.Root
			className={cn(
				"relative w-10.5 h-6.25 px-0.5 rounded-full cursor-pointer transition-colors bg-toggle-off data-[state=checked]:bg-toggle-on focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-default disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}>
			{/* In right-to-left pages (Arabic), "on" moves the thumb to the left. */}
			<RadixSwitch.Thumb className="block size-5.25 rounded-full bg-toggle-thumb transition-transform data-[state=checked]:translate-x-4.75 rtl:data-[state=checked]:-translate-x-4.75" />
		</RadixSwitch.Root>
	);
}
