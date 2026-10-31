import {
	getDocument,
	GlobalWorkerOptions,
} from "pdfjs-dist/legacy/build/pdf.mjs";
import type { PDFPageProxy } from "pdfjs-dist";

const assets = new URL("../../node_modules/pdfjs-dist/", import.meta.url);

GlobalWorkerOptions.workerSrc = new URL("build/pdf.worker.mjs", assets).href;

interface TextItem {
	str: string;
	transform: number[];
	dir: string;
}

interface PhysicalRow {
	y: number;
	cells: string[];
}

export type AccountStatementRow = {
	date: string;
	description: string;
	debit: string;
	credit: string;
	balance: string;
};

function getColumn(x: number) {
	if (x < 120) return 0; // Date
	if (x < 350) return 1; // Description
	if (x < 430) return 2; // Debit
	if (x < 500) return 3; // Credit
	return 4; // Balance
}

function isDate(value: string) {
	return /^\d{4}\/\d{2}\/\d{2}$/.test(value.trim());
}

export async function extractTableFromPage(
	page: PDFPageProxy,
): Promise<AccountStatementRow[]> {
	const textContent = await page.getTextContent();
	const items = (textContent.items as TextItem[]) ?? [];

	const rowMap = new Map<number, TextItem[]>();
	const yTolerance = 2;

	// 1. Group text into physical lines using Y position
	for (const item of items) {
		if (!item.str || item.str.trim() === "") continue;

		const y = item.transform[5] ?? 0;

		let matchedY: number | null = null;

		for (const existingY of rowMap.keys()) {
			if (Math.abs(existingY - y) <= yTolerance) {
				matchedY = existingY;
				break;
			}
		}

		if (matchedY !== null) {
			rowMap.get(matchedY)?.push(item);
		} else {
			rowMap.set(y, [item]);
		}
	}

	// 2. Convert physical lines into our 5 columns
	const physicalRows: PhysicalRow[] = [];

	const sortedYKeys = [...rowMap.keys()].sort((a, b) => b - a);

	for (const y of sortedYKeys) {
		const rowItems = rowMap.get(y) ?? [];

		// Sort left → right
		rowItems.sort((a, b) => (a.transform[4] ?? 0) - (b.transform[4] ?? 0));
		// Date | Description | Debit | Credit | Balance
		const cells = ["", "", "", "", ""];

		for (const item of rowItems) {
			const x = item.transform[4] ?? 0;
			const column = getColumn(x);
			const text = item.str.trim();

			if (!text) continue;

			cells[column] =
				item.dir === "rtl"
					? cells[column]
						? `${text} ${cells[column]}`
						: text
					: cells[column]
						? `${cells[column]} ${text}`
						: text;
		}

		/*
			Sometimes PDF.js gives:

			2026/05/15 some description

			inside the date column.

			Separate the date from the extra text.
		*/
		const firstColumn = cells[0] ?? "";

		const dateMatch = firstColumn.match(/\d{4}\/\d{2}\/\d{2}/);

		if (dateMatch) {
			const date = dateMatch[0];
			const extraText = firstColumn
				.replace(date, "")
				.replace(/\s+/g, " ")
				.trim();

			cells[0] = date;

			if (extraText) {
				cells[1] = `${extraText} ${cells[1] ?? ""}`.trim();
			}
		}

		physicalRows.push({
			y,
			cells,
		});
	}

	// 3. Find the table header
	const headerRow = physicalRows.find((row) => {
		const text = row.cells.join(" ");

		return text.includes("DATE") && text.includes("DESCRIPTION");
	});

	// 4. Find the footer
	const footerRow = physicalRows.find((row) => {
		const text = row.cells.join(" ");

		return text.includes("Printed through KFH Online");
	});

	// 5. Keep only rows inside the transaction table
	const tableRows = physicalRows.filter((row) => {
		if (headerRow && row.y >= headerRow.y) {
			return false;
		}

		if (footerRow && row.y <= footerRow.y) {
			return false;
		}

		return true;
	});

	// 6. Find rows containing transaction dates
	const dateRows = tableRows.filter((row) => isDate(row.cells[0] ?? ""));

	if (dateRows.length === 0) {
		return [];
	}

	// 7. Create one group for every transaction
	const transactionGroups = dateRows.map((dateRow) => ({
		dateRow,
		rows: [] as PhysicalRow[],
	}));

	// 8. Assign physical rows to the nearest transaction date
	for (const row of tableRows) {
		let closestGroup = transactionGroups[0];

		if (!closestGroup) continue;

		let closestDistance = Math.abs(row.y - closestGroup.dateRow.y);

		for (const group of transactionGroups) {
			const distance = Math.abs(row.y - group.dateRow.y);

			if (distance < closestDistance) {
				closestGroup = group;
				closestDistance = distance;
			}
		}

		closestGroup.rows.push(row);
	}

	// 9. Build final transactions
	const structuredTable: AccountStatementRow[] = [];

	for (const group of transactionGroups) {
		const transaction = [
			group.dateRow.cells[0] ?? "", // Date
			"", // Description
			"", // Debit
			"", // Credit
			"", // Balance
		];

		// Keep physical rows top → bottom
		group.rows.sort((a, b) => b.y - a.y);

		for (const physicalRow of group.rows) {
			const cells = physicalRow.cells;

			/*
				If column 0 contains text that is NOT a date,
				treat it as part of the description.
			*/
			const columnZero = cells[0]?.trim() ?? "";

			if (columnZero && !isDate(columnZero)) {
				transaction[1] = `${transaction[1] ?? ""} ${columnZero}`.trim();
			}

			// Description
			const description = cells[1]?.trim() ?? "";

			if (description) {
				transaction[1] = `${transaction[1] ?? ""} ${description}`.trim();
			}

			// Debit, Credit and Balance
			for (let column = 2; column <= 4; column++) {
				const value = cells[column]?.trim() ?? "";

				if (!value) continue;

				transaction[column] = transaction[column]
					? `${transaction[column]} ${value}`
					: value;
			}
		}

		const description =
			transaction[1]
				?.replace(/\s*-\s*-\s*/g, " - ") // collapse doubled dashes
				.replace(/\s*-\s*$/, "") // drop a trailing dash
				.trim() ?? "";

		// Convert array into object with named keys
		structuredTable.push({
			date: transaction[0] ?? "",
			description: description ?? "",
			debit: transaction[2] ?? "",
			credit: transaction[3] ?? "",
			balance: transaction[4] ?? "",
		});
	}

	return structuredTable;
}

// ---------------------------------
// PDF setup
// ---------------------------------

export async function parseAccountStatement(
	data: Uint8Array,
) {
	const pdf = await getDocument({
		data: data,

		cMapUrl: new URL("cmaps/", assets).href,

		standardFontDataUrl: new URL("standard_fonts/", assets).href,

		wasmUrl: new URL("wasm/", assets).href,
	}).promise;
	const allTransactions: AccountStatementRow[] = [];
	let accountNumber: string | null = null;

	for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
		const page = await pdf.getPage(pageNumber);

		const transactions = await extractTableFromPage(page);

		if (pageNumber === 1) {
			accountNumber = await extractAccountNumber(page);
		}
		allTransactions.push(...transactions);
	}

	return { accountNumber, rows: allTransactions };;
}

export function verifyBalances(transactions: AccountStatementRow[]): number[] {
	const failedIndex: number[] = [];

	for (let i = 0; i < transactions.length - 1; i++) {
		const prevBalance = Number(transactions[i]?.balance.replace(/,/g, ""));
		const credit = Number(transactions[i + 1]?.credit.replace(/,/g, ""));
		const debit = Number(transactions[i + 1]?.debit.replace(/,/g, ""));
		const currentBalance = Number(
			transactions[i + 1]?.balance.replace(/,/g, ""),
		);

		if (
			currentBalance.toFixed(3) !== (prevBalance - debit + credit).toFixed(3)
		) {
			failedIndex.push(i);
		}
	}

	return failedIndex;
}

export async function extractAccountNumber(
	page: PDFPageProxy,
): Promise<string | null> {
	const textContent = await page.getTextContent();
	const items = textContent.items as TextItem[];

	for (const item of items) {
		const text = item.str.trim();

		if (/^KW\d{2}[A-Z]{4}[0-9A-Z]{22}$/.test(text)) {
			return text.slice(-12);
		}
	}

	for (const item of items) {
		const text = item.str.trim();

		if (/^\d{12}$/.test(text)) {
			return text;
		}
	}

	return null;
}
