import {
	useId,
	useState,
	type ChangeEvent,
	type Ref,
	type TextareaHTMLAttributes,
} from "react";
import { cn } from "../../lib/cn";

type TextAreaProps = {
	label?: string;
	error?: string;
	limit?: number;
	ref?: Ref<HTMLTextAreaElement>;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

function TextArea({
	label,
	error,
	limit = 500,
	id,
	ref,
	rows = 4,
	onChange,
	...props
}: TextAreaProps) {
	const generatedId = useId();
	const textAreaId = id ?? generatedId;
	const errorId = `${textAreaId}-error`;
	const counterId = `${textAreaId}-counter`;

	const isControlled = props.value !== undefined;

	const [uncontrolledCount, setUncontrolledCount] = useState(
		String(props.defaultValue ?? "").length,
	);

	const count = isControlled
		? String(props.value ?? "").length
		: uncontrolledCount;

	const overLimit = count > limit;

	function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
		if (!isControlled) setUncontrolledCount(event.target.value.length);
		onChange?.(event);
	}

	return (
		<div className="grid gap-1.5">
			{label && (
				<label
					htmlFor={textAreaId}
					className="text-text-secondary text-caption-lg"
				>
					{label}
				</label>
			)}

			<div
				className={cn(
					"flex flex-col gap-3 px-3 py-2.5 bg-input-background border rounded-sm focus-within:ring-2",
					error || overLimit
						? "border-ring-destructive focus-within:ring-ring-destructive"
						: "border-interactive-secondary-active focus-within:ring-ring-default",
				)}
			>
				<textarea
					id={textAreaId}
					ref={ref}
					rows={rows}
					onChange={handleChange}
					aria-invalid={!!error || overLimit}
					aria-describedby={error ? `${errorId} ${counterId}` : counterId}
					className="w-full bg-transparent outline-none resize-none placeholder:text-input-placeholder text-body-sm text-text-primary"
					{...props}
				/>

				<div
					id={counterId}
					aria-live="polite"
					className={cn(
						"text-end text-caption-md",
						overLimit ? "text-ring-destructive" : "text-text-secondary",
					)}
				>
					{count}/{limit} chars
				</div>
			</div>

			{error && (
				<small id={errorId} className="text-caption-sm text-ring-destructive">
					{error}
				</small>
			)}
		</div>
	);
}

export { TextArea };