import type { RowType } from "../../generated/prisma/enums";
import { ROW_TYPE_LABELS, rowTypeRules } from "./pdfConfig";

export function stripCommas(amount: string) {
	return amount.replace(/,/g, "");
}

export function formatDate(date: string) {
	return new Date(date.slice(0, 10).replace(/\//g, "-"));
}

export function formatCardDate(date: string) {
	const [day, month, year] = date.split("-");
	return new Date(`${year}-${month}-${day}`);
}

export function getMonthBounds(dateStr: string) {
	const [yearStr, monthStr] = dateStr.split("-") as [string, string?];

	const month = Number(monthStr);
	const year = Number(yearStr || NaN);

	if (isNaN(month) || isNaN(year)) {
		throw new Error("Invalid date format. Expected 'YYYY-M' or 'YYYY-MM'.");
	}
	const first = new Date(Date.UTC(year, month - 1, 1));

	const last = new Date(Date.UTC(year, month, 0));

	return {
		startDate: first,
		endDate: last,
	};
}

export function getRowType(input: string) {
	const description = input.toLowerCase();
	const matched = rowTypeRules.find((rule) =>
		rule.patterns.some((p) => description.includes(p)),
	);
	if (!matched) return "unknown";

	return matched.rowType;
}
export function parseDescription(input: string) {}

export function getMerchant(description: string, rowType: RowType) {
	if (rowType === "debit_card_purchase" || rowType === "pos_purchase") {
		return extractMerchant(description, rowType) || ROW_TYPE_LABELS[rowType];
	}

	return ROW_TYPE_LABELS[rowType];
}

export function extractMerchant(description: string, rowType: RowType) {
	const parts = description.split("-");

	if (rowType === "debit_card_purchase") return parts.slice(3).join("-").trim();
	if (rowType === "pos_purchase") {
		const mccIndex = parts.findIndex((i) => /^\d{4}$/.test(i.trim()));
		if (mccIndex === -1) return parts.slice(3).join("-").trim();

		const merchantArray = parts.slice(3, mccIndex).filter((i) => {
			const part = i.trim();
			return !/^\d+$/.test(part) && part.length <= 24;
		});

		const mcc = parts[mccIndex];

		const merchant = merchantArray.join("-").trim();

		return merchant;
	}

	return undefined;
}
export function extractMCC(description: string, rowType: RowType) {
	const parts = description.split("-");

	if (rowType === "pos_purchase") {
		const mccIndex = parts.findIndex((i) => /^\d{4}$/.test(i.trim()));
		if (mccIndex === -1) return undefined;

		const mcc = parts[mccIndex]?.trim();


		return mcc;
	}

	return undefined;
}

export function getCategory(){
	
} 
