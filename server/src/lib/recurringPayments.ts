export const getCycle = (latestSalaryDate: Date) => {
	const start = new Date(
		Date.UTC(
			latestSalaryDate.getUTCFullYear(),
			latestSalaryDate.getUTCMonth(),
			latestSalaryDate.getUTCDate(),
		),
	);
	const nextMonthDays = new Date(
		Date.UTC(
			latestSalaryDate.getUTCFullYear(),
			latestSalaryDate.getUTCMonth() + 2,
			0,
		),
	).getUTCDate();

	const end = new Date(
		Date.UTC(
			latestSalaryDate.getUTCFullYear(),
			latestSalaryDate.getUTCMonth() + 1,
			Math.min(start.getUTCDate(), nextMonthDays) - 1,
		),
	);

	return { start, end };
};
export const dueDateInCycle = (expectedDay: number, cycleStart: Date) => {
	const year = cycleStart.getUTCFullYear();
	const startMonth = cycleStart.getUTCMonth();
	const startDay = cycleStart.getUTCDate();

	const month = expectedDay >= startDay ? startMonth : startMonth + 1;

	const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
	const day = Math.min(expectedDay, daysInMonth);

	return new Date(Date.UTC(year, month, day));
};

type PaymentSettings = {
	expectedAmount: number;
	amountVaries: boolean;
	isActive: boolean;
};

type LinkedTransaction = {
	date: Date;
	amount: number;
};

type PaymentStatusResult = {
	status: "inactive" | "paid" | "due" | "waiting" | "missing";
	paidOn: Date | null;
	paidAmount: number | null;
	priceChange: number | null;
};
export const paymentStatus = (
	paymentSettings: PaymentSettings,
	dueDate: Date,
	linkedTransactions: LinkedTransaction[],
	dataUntil: Date | null,
	today: Date,
): PaymentStatusResult => {
	if (!paymentSettings.isActive) {
		return {
			status: "inactive",
			paidOn: null,
			paidAmount: null,
			priceChange: null,
		};
	}
	if (linkedTransactions.length > 0) {
		const latest = linkedTransactions.reduce((carried, current) =>
			current.date.getTime() > carried.date.getTime() ? current : carried,
		);
		const difference = latest.amount - paymentSettings.expectedAmount;

		const isWorthFlagging = paymentSettings.amountVaries
			? Math.abs(difference) > paymentSettings.expectedAmount * 0.25
			: difference !== 0;

		return {
			status: "paid",
			paidOn: latest.date,
			paidAmount: latest.amount,
			priceChange: isWorthFlagging ? difference : null,
		};
	}

	if (today.getTime() < dueDate.getTime()) {
		return {
			status: "due",
			paidOn: null,
			paidAmount: null,
			priceChange: null,
		};
	}
	const graceEnd = new Date(dueDate.getTime() + 5 * 24 * 60 * 60 * 1000);
	if (!dataUntil || dataUntil.getTime() < graceEnd.getTime()) {
		return {
			status: "waiting",
			paidOn: null,
			paidAmount: null,
			priceChange: null,
		};
	}

	return {
		status: "missing",
		paidOn: null,
		paidAmount: null,
		priceChange: null,
	};
};
