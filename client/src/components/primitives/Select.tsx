// Select.tsx
import * as RadixSelect from "radix-ui/select";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type SelectProps = {
	label?: string;
	ariaLabel?: string;
	options: { label: string; value: string }[];
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
		<div className="flex flex-col gap-2">
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
						"w-full min-w-0 flex items-center justify-between gap-2 p-3 bg-input-background border rounded-sm text-label-lg text-text-primary cursor-pointer focus:outline-none focus-visible:outline-none focus:ring-2",
						error
							? "border-ring-destructive focus:ring-ring-destructive data-[state=open]:border-ring-destructive"
							: "border-border-default focus:ring-ring-default data-[state=open]:border-border-focus",
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
						className="w-(--radix-select-trigger-width) min-w-max z-50 p-1 bg-card-default rounded-sm border border-border-default">
						<RadixSelect.ScrollUpButton className="flex justify-center py-1 text-text-secondary">
							<ChevronUp className="size-4" />
						</RadixSelect.ScrollUpButton>

						<RadixSelect.Viewport className="max-h-36">
							{options.map((o) => (
								<RadixSelect.Item
									key={o.value}
									value={o.value}
									className="flex items-center justify-between gap-2 p-2.5 rounded-xs text-body-sm text-text-primary cursor-pointer focus:outline-none data-highlighted:bg-interactive-primary-hover/20 data-[state=checked]:text-interactive-primary">
									<RadixSelect.ItemText>{o.label}</RadixSelect.ItemText>
									<RadixSelect.ItemIndicator>
										<Check className="size-4" />
									</RadixSelect.ItemIndicator>
								</RadixSelect.Item>
							))}
						</RadixSelect.Viewport>

						<RadixSelect.ScrollDownButton className="flex justify-center py-1 text-text-secondary">
							<ChevronDown className="size-4" />
						</RadixSelect.ScrollDownButton>
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
