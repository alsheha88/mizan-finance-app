import {
	getDocument,
	GlobalWorkerOptions,
} from "pdfjs-dist/legacy/build/pdf.mjs";
import type { PDFPageProxy } from "pdfjs-dist";
import fs from "node:fs";

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

export type CardStatementRow = {
	date: string;
	description: string;
	amount: string;
};

function isDate(value: string) {
	return /^\d{2}-\d{2}-\d{4}$/.test(value.trim());
}

function getColumn(x: number) {
	if (x < 70) return 0; // Posting Date
	if (x < 160) return 1; // Transaction Date
	if (x < 470) return 2; // Description
	if (x < 510) return 3; // Foreign Currency
	if (x < 580) return 4; // Foreign Amount
	return 5; // KWD Amount
}

// ---------------------------------
// PDF setup
// ---------------------------------

export async function parseCardStatement(
	data: Uint8Array,
): Promise<{ allTransactions: CardStatementRow[]; transactionsCount: number }> {
	const pdf = await getDocument({
		data: data,

		cMapUrl: new URL("cmaps/", assets).href,

		standardFontDataUrl: new URL("standard_fonts/", assets).href,

		wasmUrl: new URL("wasm/", assets).href,
	}).promise;

	const allTransactions: CardStatementRow[] = [];
	let transactionsCount: number = 0;

	for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
		const page = await pdf.getPage(pageNumber);

		const transactions = await extractTableFromPage(page);
		transactionsCount = transactions.transactionsCount;

		allTransactions.push(...transactions.cardTransactions);
	}

	console.log(transactionsCount);

	return { allTransactions, transactionsCount };
}

function readFile(path: string) {
	return new Uint8Array(fs.readFileSync(path));
}

export async function extractTableFromPage(page: PDFPageProxy): Promise<{
	cardTransactions: CardStatementRow[];
	transactionsCount: number;
}> {
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
		const cells = ["", "", "", "", "", ""];

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

		physicalRows.push({
			y,
			cells,
		});
	}

	// 3. Find the table header
	const headerRow = physicalRows.find((row) => {
		const text = row.cells.join(" ");

		return (
			text.includes("Transaction Date") && text.includes("Transactions Details")
		);
	});

	// 4. Find the footer
	const footerRow = physicalRows.find((row) => {
		const text = row.cells.join(" ");

		return text.includes("No. Of Transactions");
	});
	const footerText = footerRow?.cells.join(" ") ?? "";
	const transactionsCount = Number(footerText.match(/(\d+)\s*$/)?.[1] ?? 0);

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
	const dateRows = tableRows.filter((row) => isDate(row.cells[1] ?? ""));

	if (dateRows.length === 0) {
		return { cardTransactions: [], transactionsCount };
	}
	

	const cardTransactions = dateRows.map((row) => {
		return {
			date: row.cells[1] ?? "",
			description: row.cells[2] ?? "",
			amount: row.cells[5] ?? "",
		};
	});

	return { cardTransactions, transactionsCount };
}
const data = readFile("src/sample/CardStatement.pdf");
const result = await parseCardStatement(data);
