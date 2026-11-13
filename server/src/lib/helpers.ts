import { NotFoundError } from "../../errors/errors";
import type { RowType } from "../../generated/prisma/enums";
import { ROW_TYPE_LABELS, rowTypeRules } from "./pdfConfig";
import { prisma } from "./prisma";

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

export function getMerchant(description: string, rowType: RowType) {
	if (rowType === "debit_card_purchase" || rowType === "pos_purchase") {
		return extractMerchant(description) || ROW_TYPE_LABELS[rowType];
	}

	return ROW_TYPE_LABELS[rowType];
}

// Phrases the bank prefixes a row with. In Arabic rows these are stripped by the
// character filter below; in English rows they survive it, so they're named here.
const ROW_TYPE_PHRASES = ["pos payment", "electron settlement"];

export function extractMerchant(description: string) {
	// Arabic and punctuation become spaces; dashes survive as the separator.
	const parts = description.replaceAll(/[^A-Za-z0-9-]/g, " ").split("-");

	// The MCC is a reliable fence: the merchant is always to its left.
	const mccIndex = parts.findIndex((i) => /^\d{4}$/.test(i.trim()));
	const beforeMcc = mccIndex === -1 ? parts : parts.slice(0, mccIndex);

	const kept = beforeMcc.filter((i) => {
		const part = i.trim();
		if (!part) return false;
		// References, terminal ids, store numbers, dates, amounts.
		if (/\d/.test(part)) return false;
		if (ROW_TYPE_PHRASES.some((phrase) => part.toLowerCase().includes(phrase)))
			return false;
		return true;
	});

	const merchant = kept.join(" ").replace(/\s+/g, " ").trim();

	return merchant || undefined;
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

export function normaliseMerchant(merchant: string) {
	const caps = merchant.toUpperCase();
	const replacedText = caps.replace(/[^A-Za-z0-9]/g, " ");
	const trimResult = replacedText.trim();
	const splitResult = trimResult.split(" ");
	const result = splitResult
		.filter((i) => i !== "TAP" && i !== "INT" && i !== "" && !i.match(/\d+/g))
		.join(" ");

	// Nothing usable survived — the caller must not store a key for this row.
	if (!result) {
		return undefined;
	}

	return result;
}

export function getCurrentKuwaitMonth(): string {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Kuwait",
		year: "numeric",
		month: "2-digit",
	}).format(new Date());
}

export async function resolveMonth(
	userId: string,
	month?: string,
): Promise<string> {
	if (month) return month;

	const latestTransaction = await prisma.transaction.findFirst({
		where: { userId },
		orderBy: { transactionDate: "desc" },
		select: { transactionDate: true },
	});

	if (!latestTransaction) return getCurrentKuwaitMonth();

	return latestTransaction.transactionDate.toISOString().slice(0, 7);
}
