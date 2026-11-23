type CardRule = {
	type: "percent";
	rate: number;
};

type LoanRule = {
	type: "fixed";
	installment: number;
};

export type Debt = {
	id: string;
	name: string;
	balance: number;
	rule: CardRule | LoanRule;
};

export function monthlyPayment(debt: Debt, balance: number) {
	if (debt.rule.type === "percent") {
		if (balance > 1000) {
			return Math.round(balance * (debt.rule.rate / 100));
		} else {
			return balance;
		}
	} else {
		return Math.min(debt.rule.installment, balance);
	}
}

export function simulateMinimums(debts: Debt[]) {
	let month = 0;
	const payoffMonths: Record<string, number> = {};
	const totals: number[] = [];
	const tracked = debts.map((i) => {
		return {
			debt: i,
			balance: i.balance,
		};
	});
	while (tracked.some((i) => i.balance > 0) && month < 600) {
		month++;
		for (const item of tracked) {
			if (item.balance === 0) continue;
			item.balance -= monthlyPayment(item.debt, item.balance);
			if (item.balance === 0) {
				payoffMonths[item.debt.id] = month;
			}
		}
		const sum = tracked.reduce((acc, b) => acc + b.balance, 0);
		totals.push(sum);
	}
	return { month, payoffMonths, totals };
}

export function simulateSnowball(debts: Debt[], extra: number) {
	let month = 0;
	const totals: number[] = [];
	const payoffMonths: Record<string, number> = {};
	const firstMonthPayments: Record<string, number> = {};
	const tracked = debts
		.map((i) => {
			return {
				debt: i,
				balance: i.balance,
			};
		})
		.sort((a, b) => a.balance - b.balance);
	const fixedBudget =
		tracked.reduce((acc, b) => acc + monthlyPayment(b.debt, b.balance), 0) +
		extra;
	while (tracked.some((i) => i.balance > 0) && month < 600) {
		month++;
		let spent = 0;
		for (const item of tracked) {
			if (item.balance === 0) continue;
			const payment = monthlyPayment(item.debt, item.balance);
			if (month === 1) {
				firstMonthPayments[item.debt.id] = payment;
			}
			item.balance -= payment;
			spent += payment;
		}
		let leftOver = fixedBudget - spent;

		for (const item of tracked) {
			if (item.balance === 0) continue;
			const give = Math.min(leftOver, item.balance);
			if (month === 1) {
				firstMonthPayments[item.debt.id] =
					(firstMonthPayments[item.debt.id] ?? 0) + give;
			}
			item.balance -= give;
			leftOver -= give;

			if (leftOver === 0) break;
		}

		for (const item of tracked) {
			if (item.balance === 0 && !(item.debt.id in payoffMonths))
				payoffMonths[item.debt.id] = month;
		}
		const sum = tracked.reduce((acc, b) => acc + b.balance, 0);
		totals.push(sum);
	}

	return {
		month,
		payoffMonths,
		totals,
		monthlyBudget: fixedBudget,
		firstMonthPayments,
	};
}

export function planDebts(debts: Debt[], extra: number) {
	const withPlan = simulateSnowball(debts, extra);
	const withoutPlan = simulateMinimums(debts);

	const monthsSaved = withoutPlan.month - withPlan.month;
	const order = debts
		.map((i) => {
			return {
				id: i.id,
				name: i.name,
				balance: i.balance,
				payoffMonth: withPlan.payoffMonths[i.id] ?? null,
				kind: i.rule.type === "percent" ? "card" : "loan",
				thisMonth: withPlan.firstMonthPayments[i.id] ?? 0,
			};
		})
		.sort((a, b) => {
			if (a.payoffMonth === null && b.payoffMonth === null) return 0;
			if (a.payoffMonth === null) return 1;
			if (b.payoffMonth === null) return -1;
			return a.payoffMonth - b.payoffMonth;
		});

	return {
		withPlan,
		withoutPlan,
		monthsSaved,
		order,
	};
}
