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
			item.balance -= payment;
			spent += payment;
		}
		let leftOver = fixedBudget - spent;

		for (const item of tracked) {
			if (item.balance === 0) continue;
			const give = Math.min(leftOver, item.balance);
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

	return { month, payoffMonths, totals };
}
