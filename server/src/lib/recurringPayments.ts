import type {
	LinkedTransaction,
	MatchCandidate,
	MatchDecision,
	MatchPayment,
	PaymentPair,
	PaymentSettings,
	PaymentStatusResult,
} from "../types/types";

const DAY_MS = 24 * 60 * 60 * 1000;

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

export const currentCycle = (latestSalaryDate: Date, today: Date) => {
	let cycle = getCycle(latestSalaryDate);

	while (today.getTime() > cycle.end.getTime()) {
		const afterEnd = new Date(
			Date.UTC(
				cycle.end.getUTCFullYear(),
				cycle.end.getUTCMonth(),
				cycle.end.getUTCDate() + 1,
			),
		);

		cycle = getCycle(afterEnd);
	}

	return cycle;
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

const dueDateInMonth = (year: number, month: number, expectedDay: number) => {
	const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
	return new Date(Date.UTC(year, month, Math.min(expectedDay, daysInMonth)));
};

export const nearestDueDate = (date: Date, expectedDay: number) => {
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth();

	const options = [
		dueDateInMonth(year, month - 1, expectedDay),
		dueDateInMonth(year, month, expectedDay),
		dueDateInMonth(year, month + 1, expectedDay),
	];

	return options.reduce((nearest, current) =>
		Math.abs(current.getTime() - date.getTime()) <
		Math.abs(nearest.getTime() - date.getTime())
			? current
			: nearest,
	);
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

export const matchRecurringPayments = (
	payments: MatchPayment[],
	candidates: MatchCandidate[],
): MatchDecision[] => {
	const pairs: PaymentPair[] = [];

	for (const candidate of candidates) {
		for (const payment of payments) {
			if (
				payment.matchKey !== candidate.matchKey ||
				payment.source !== candidate.source
			)
				continue;
			const occurrence = nearestDueDate(candidate.date, payment.expectedDay);
			const dayDiff =
				Math.abs(occurrence.getTime() - candidate.date.getTime()) /
				(24 * 60 * 60 * 1000);
			const taken = payment.linkedDates.some(
				(i) =>
					nearestDueDate(i, payment.expectedDay).getTime() ===
					occurrence.getTime(),
			);
			if (dayDiff > 5 || taken) continue;
			const amountDiff = Math.abs(candidate.amount - payment.expectedAmount);

			pairs.push({
				candidate,
				payment,
				occurrence,
				amountDiff,
				dayDiff,
			});
		}
	}
	pairs.sort((a, b) => a.amountDiff - b.amountDiff || a.dayDiff - b.dayDiff);

	const usedTransactions = new Set<string>();
	const filledBills = new Set<string>();

	const decisions: MatchDecision[] = [];

	for (const pair of pairs) {
		const billKey = `${pair.payment.id}|${pair.occurrence.getTime()}`;
		if (usedTransactions.has(pair.candidate.id) || filledBills.has(billKey))
			continue;
		usedTransactions.add(pair.candidate.id);
		filledBills.add(billKey);
		decisions.push({
			transactionId: pair.candidate.id,
			source: pair.candidate.source,
			recurringPaymentId: pair.payment.id,
		});
	}

	return decisions;
};
