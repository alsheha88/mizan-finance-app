export function stripCommas(amount: string) {
	return amount.replace(/,/g, "");
}

export function formatDate(date: string) {
	return new Date(date.slice(0, 10).replace(/\//g, "-"));
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
