// Select.tsx
import * as RadixSelect from "radix-ui/select";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/cn";

type SelectProps = {
	label: string;
	options: { label: string; value: string }[];
	placeholder: string;
	error?: string;
	value?: string;
	onValueChange?: (value: string) => void;
};

export function Select({
	label,
	options,
	placeholder,
	error,
	value,
	onValueChange,
}: SelectProps) {
	const id = useId();
	const labelId = `${id}-label`;
	const errorId = `${id}-error`;

	return (
		<div className="flex flex-col gap-2">
			<label id={labelId} className="text-text-secondary text-caption-lg">
				{label}
			</label>

			<RadixSelect.Root
				{...(value !== undefined && { value })}
				{...(onValueChange !== undefined && { onValueChange })}>
				<RadixSelect.Trigger
					aria-labelledby={labelId}
					aria-invalid={!!error}
					aria-describedby={error ? errorId : undefined}
					className={cn(
						"min-w-2xs flex items-center justify-between gap-2 p-3 bg-input-background border rounded-sm text-body-sm text-text-primary cursor-pointer focus:outline-none focus-visible:outline-none focus:ring-2",
						error
							? "border-ring-destructive focus:ring-ring-destructive data-[state=open]:border-ring-destructive"
							: "border-border-default focus:ring-ring-default data-[state=open]:border-border-focus",
					)}>
					<RadixSelect.Value placeholder={placeholder} />
					<RadixSelect.Icon>
						<ChevronDown className="size-4" />
					</RadixSelect.Icon>
				</RadixSelect.Trigger>

				<RadixSelect.Portal>
					<RadixSelect.Content
						position="popper"
						sideOffset={4}
						className="w-(--radix-select-trigger-width) z-50 p-1 bg-popover-default rounded-sm border border-border-default">
						<RadixSelect.ScrollUpButton className="flex justify-center py-1 text-text-secondary">
							<ChevronUp className="size-4" />
						</RadixSelect.ScrollUpButton>

						<RadixSelect.Viewport className="max-h-36">
							{options.map((o) => (
								<RadixSelect.Item
									key={o.value}
									value={o.value}
									className="flex items-center justify-between gap-2 p-2.5 rounded-xs text-body-sm text-text-primary cursor-pointer focus:outline-none data-[highlighted]:bg-interactive-secondary-hover data-[state=checked]:text-interactive-primary">
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
