/**
 * Throwaway diagnostic: runs every distinct merchant already in the database
 * through normaliseMerchant and prints "before -> after", sorted by the result
 * so that any two merchants collapsing to the same key appear next to each other.
 *
 * Run from server/:  npx tsx scripts/check-merchants.ts
 */
import { prisma } from "../src/lib/prisma";
import { normaliseMerchant } from "../src/lib/helpers";

const MERCHANT_ROW_TYPES = ["debit_card_purchase", "pos_purchase"] as const;

async function main() {
	const accountRows = await prisma.transaction.findMany({
		where: { rowType: { in: [...MERCHANT_ROW_TYPES] } },
		select: { merchant: true },
		distinct: ["merchant"],
	});

	const cardRows = await prisma.cardTransaction.findMany({
		where: { cardTransactionType: "purchase" },
		select: { merchant: true },
		distinct: ["merchant"],
	});

	const rows = [
		...accountRows.map((r) => ({ source: "account", merchant: r.merchant })),
		...cardRows.map((r) => ({ source: "card", merchant: r.merchant })),
	];

	const results = rows
		.map((r) => ({ ...r, key: normaliseMerchant(r.merchant) }))
		.sort((a, b) => a.key.localeCompare(b.key));

	const byKey = new Map<string, typeof results>();
	for (const r of results) {
		const list = byKey.get(r.key) ?? [];
		list.push(r);
		byKey.set(r.key, list);
	}

	console.log(`${rows.length} distinct merchants -> ${byKey.size} keys\n`);

	for (const r of results) {
		const shared = (byKey.get(r.key)?.length ?? 0) > 1 ? "  <-- shared key" : "";
		console.log(
			`[${r.source.padEnd(7)}] ${JSON.stringify(r.merchant).padEnd(55)} -> ${r.key}${shared}`,
		);
	}

	const collisions = [...byKey.entries()].filter(([, list]) => {
		const distinctMerchants = new Set(list.map((r) => r.merchant));
		return distinctMerchants.size > 1;
	});

	if (collisions.length === 0) {
		console.log("\nNo two different merchants share a key.");
	} else {
		console.log(`\n${collisions.length} key(s) shared by different merchants — check these are genuinely the same shop:`);
		for (const [key, list] of collisions) {
			console.log(`\n  ${key}`);
			for (const r of list) console.log(`    [${r.source}] ${r.merchant}`);
		}
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exitCode = 1;
	})
	.finally(() => prisma.$disconnect());
