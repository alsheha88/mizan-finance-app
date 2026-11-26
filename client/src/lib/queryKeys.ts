// Every TanStack Query key in one place.
//
// `all` is the prefix of an entity's keys: invalidating it refreshes every
// query that starts with it (all months, all pages, all filters). The functions
// build the key for one specific query. Using these instead of typing arrays by
// hand means a typo ("cardTransactions" vs "cardsTransactions") can't silently
// break cache invalidation again.
export const queryKeys = {
	me: ["me"],
	dashboard: {
		all: ["dashboard"],
		byMonth: (month: string | undefined) => ["dashboard", month],
	},
	transactions: {
		all: ["transactions"],
		list: (params: unknown) => ["transactions", params],
	},
	cardTransactions: {
		all: ["cardsTransactions"],
		list: (params: unknown) => ["cardsTransactions", params],
	},
	accounts: {
		all: ["accounts"],
		detail: (id: string | undefined) => ["accounts", id],
	},
	cards: {
		all: ["cards"],
		detail: (id: string | undefined) => ["cards", id],
	},
	loans: {
		all: ["loans"],
		list: (params: unknown) => ["loans", params],
	},
	categories: {
		all: ["categories"],
	},
	conversations: {
		all: ["conversations"],
		detail: (id: string | undefined) => ["conversations", id],
	},
	debtPlan: {
		all: ["debtPlan"],
		byExtra: (extra: number) => ["debtPlan", extra],
	},
} as const;
