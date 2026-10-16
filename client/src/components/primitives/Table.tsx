import { cn } from "@/lib/cn";
import type {
	HTMLAttributes,
	TableHTMLAttributes,
	TdHTMLAttributes,
	ThHTMLAttributes,
} from "react";

export function Table({
	className,
	...props
}: TableHTMLAttributes<HTMLTableElement>) {
	return (
		<div className="rounded-md border border-border-default overflow-x-auto">
			<table className={cn("w-full border-collapse", className)} {...props} />
		</div>
	);
}

export function THead({
	className,
	...props
}: HTMLAttributes<HTMLTableSectionElement>) {
	return (
		<thead
			className={cn(
				"bg-table-header border-b border-border-default",
				className,
			)}
			{...props}
		/>
	);
}

export function TRow({
	className,
	...props
}: HTMLAttributes<HTMLTableRowElement>) {
	return (
		<tr
			className={cn(
				"border-b border-border-subtle last:border-b-0 hover:bg-table-row-hover transition-colors",
				className,
			)}
			{...props}
		/>
	);
}

export function TH({
	className,
	...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
	return (
		<th
			scope="col"
			className={cn(
				"px-4 py-3 text-start text-label-sm text-text-tertiary",
				className,
			)}
			{...props}
		/>
	);
}

export function TCell({
	className,
	...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
	return (
		<td
			className={cn("px-4 py-3 text-body-sm text-text-primary", className)}
			{...props}
		/>
	);
}