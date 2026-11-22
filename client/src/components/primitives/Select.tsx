// Select.tsx
import * as RadixSelect from "radix-ui/select";
import { ChevronDown, Check } from "lucide-react";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { paletteColors, type PaletteColor } from "@/lib/paletteColors";

export type SelectOption = {
	label: string;
	value: string;
	color?: PaletteColor | undefined;
};

type SelectProps = {
	label?: string;
	ariaLabel?: string;
	options: SelectOption[];
	placeholder: string;
	error?: string | undefined;
	value?: string | undefined;
	onValueChange?: ((value: string) => void) | undefined;
	onOpenChange?: ((open: boolean) => void) | undefined;
	defaultOpen?: boolean | undefined;
	startIcon?: ReactNode;
	showChevron?: boolean;
	className?: string;
};

export function Select({
	label,
	ariaLabel,
	options,
	placeholder,
	error,
	value,
	onValueChange,
	onOpenChange,
	defaultOpen,
	startIcon,
	showChevron = true,
	className,
}: SelectProps) {
	const id = useId();
	const labelId = `${id}-label`;
	const errorId = `${id}-error`;

	return (
		<div className="flex flex-col gap-1.5">
			{label && (
				<label id={labelId} className="text-text-secondary text-caption-lg">
					{label}
				</label>
			)}

			<RadixSelect.Root
				{...(value !== undefined && { value })}
				{...(onValueChange !== undefined && { onValueChange })}
				{...(onOpenChange !== undefined && { onOpenChange })}
				{...(defaultOpen !== undefined && { defaultOpen })}>
				<RadixSelect.Trigger
					aria-labelledby={label ? labelId : undefined}
					aria-label={label ? undefined : ariaLabel}
					aria-invalid={!!error}
					aria-describedby={error ? errorId : undefined}
					className={cn(
						"w-full min-w-0 flex items-center justify-between gap-2 px-3 py-2.5 bg-input-background border rounded-sm text-body-sm text-text-primary cursor-pointer focus:outline-none focus-visible:outline-none focus:ring-2",
						error
							? "border-ring-destructive focus:ring-ring-destructive data-[state=open]:border-ring-destructive"
							: "border-input-default focus:ring-ring-default data-[state=open]:border-border-focus",
						className,
					)}>
					<span className="flex items-center gap-2">
						{startIcon}
						<RadixSelect.Value placeholder={placeholder} />
					</span>

					{showChevron && (
						<RadixSelect.Icon>
							<ChevronDown className="size-4" />
						</RadixSelect.Icon>
					)}
				</RadixSelect.Trigger>

				<RadixSelect.Portal>
					<RadixSelect.Content
						position="popper"
						sideOffset={4}
						className="min-w-(--radix-select-trigger-width) z-50 p-1 bg-bg-elevated rounded-md border border-border-default shadow-overlay">
						<RadixSelect.Viewport className="max-h-64">
							{options.map((o) => (
								<RadixSelect.Item
									key={o.value}
									value={o.value}
									className="flex items-center justify-between gap-3 px-2.5 py-2 rounded-sm text-body-sm text-text-primary cursor-pointer transition-colors focus:outline-none data-highlighted:bg-surface-active data-[state=checked]:text-accent-foreground">
									<span className="flex items-center gap-2.5 min-w-0">
										{o.color && (
											<span
												aria-hidden="true"
												className={cn(
													"size-2 shrink-0 rounded-full",
													paletteColors[o.color].swatch,
												)}
											/>
										)}
										<RadixSelect.ItemText>{o.label}</RadixSelect.ItemText>
									</span>
									<RadixSelect.ItemIndicator>
										<Check className="size-4" />
									</RadixSelect.ItemIndicator>
								</RadixSelect.Item>
							))}
						</RadixSelect.Viewport>
					</RadixSelect.Content>
				</RadixSelect.Portal>
			</RadixSelect.Root>

			{error && (
				<small id={errorId} className="text-caption-sm text-ring-destructive">
					{error}
				</small>
			)}
		</div>
	);
}
