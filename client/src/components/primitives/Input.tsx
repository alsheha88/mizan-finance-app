import {
	useId,
	type InputHTMLAttributes,
	type ReactNode,
	type Ref,
} from "react";
import { cn } from "../../lib/cn";

type InputProps = {
	label?: string;
	type: "text" | "password" | "number" | "date" | "email";
	error?: string | undefined;
	startIcon?: ReactNode;
	ref?: Ref<HTMLInputElement>;
} & InputHTMLAttributes<HTMLInputElement>;

function Input({
	label,
	type,
	error,
	id,
	ref,
	startIcon,
	className,
	...props
}: InputProps) {
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const errorId = `${inputId}-error`;

	return (
		<div className="grid gap-1.5">
			{label && (
				<label
					htmlFor={inputId}
					className="text-text-secondary text-caption-lg">
					{label}
				</label>
			)}
				<div className="relative grid">
				{startIcon && (
					<span className="absolute inset-s-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-text-tertiary">
						{startIcon}
					</span>
				)}

				<input
					id={inputId}
					type={type}
					ref={ref}
					aria-invalid={!!error}
					aria-describedby={error ? errorId : undefined}
					className={cn(
						"px-3 py-2.5 bg-input-background border rounded-sm text-body-sm text-text-primary placeholder:text-input-placeholder focus:outline-none focus:ring-2",
						error
							? "border-ring-destructive focus:ring-ring-destructive"
							: "border-interactive-secondary-active focus:ring-ring-default",
						startIcon && "ps-10", className
					)}
					{...props}
				/>
			</div>

			{error && (
				<small id={errorId} className="text-caption-sm text-ring-destructive">
					{error}
				</small>
			)}
		</div>
	);
}

export { Input };
