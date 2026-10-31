export const range = (start: number, end: number) => {
	return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const getPageNumbers = (
	currentPage: number,
	totalPages: number,
	siblingCount = 1,
) => {
	const leftSibling = Math.max(currentPage - siblingCount, 1);
	const rightSibling = Math.min(currentPage + siblingCount, totalPages);
	const showLeftDots = leftSibling > 2;
	const showRightDots = rightSibling < totalPages - 1;
	const dots = "...";

	if (totalPages <= 5) {
		return range(1, totalPages);
	} else if (!showLeftDots && showRightDots) {
		return [...range(1, 5), dots, totalPages]; // near start
	} else if (showLeftDots && !showRightDots) {
		return [1, dots, ...range(totalPages - 4, totalPages)]; // near end
	} else {
		return [1, dots, ...range(leftSibling, rightSibling), dots, totalPages]; // middle
	}
};

export const formatKWD = (amount: number) =>
	new Intl.NumberFormat("en-KW", {
		style: "currency",
		currency: "KWD",
	}).format(amount);

export const capitalizeFirstLetter = (str: string) => {
	if (!str) return "";
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const maskAccountNumber = (str: string) => {
	return `****${str.slice(-4)}`;
};

export const calculatePercentage = (previous: number, current: number) => {
	let percentage = 0;
	if (previous === 0) {
		percentage = 0;
		return percentage;
	}
	percentage = ((current - previous) / previous) * 100;
	return percentage;
};

export const getCurrentMonth = () => {
	const now = new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export const toCalendarDate = (date: Date) =>
	new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

export const formatDate = (iso: string | Date) =>
	new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(iso));
export const formatDateShort = (iso: string | Date) =>
	new Intl.DateTimeFormat("en-GB", {
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(iso));
export const formatDateMonthDay = (iso: string | Date) =>
	new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		timeZone: "UTC",
	}).format(new Date(iso));

export const getDateRange = (length = 6) => {
	const now = new Date();
	return Array.from({ length }, (_, i) => {
		const d = new Date(Date.UTC(now.getFullYear(), now.getMonth() - i, 1));
		return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
	});
};

export const formatMonthLabel = (month: string) => {
	const [year, monthNumber] = month.split("-");
	const d = new Date(Date.UTC(Number(year), Number(monthNumber) - 1, 1));

	return new Intl.DateTimeFormat("en-GB", {
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(d);
};

export function getShortMonthName(monthNumber: number) {
	const formatter = new Intl.DateTimeFormat("en", { month: "short" });
	return formatter.format(new Date(2000, monthNumber - 1, 1));
}

export const getInitials = (name: string) => {
	if (!name) return null;
	if (!name.includes(" ")) {
		return name.slice(0, 2).toUpperCase();
	} else {
		const split = name.split(" ");

		return (
			split[0]!.charAt(0).toUpperCase() + split[1]?.charAt(0).toUpperCase()
		);
	}
};
