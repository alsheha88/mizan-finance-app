import type Anthropic from "@anthropic-ai/sdk";

export type PaymentSettings = {
	expectedAmount: number;
	amountVaries: boolean;
	isActive: boolean;
};

export type LinkedTransaction = {
	date: Date;
	amount: number;
};

export type PaymentStatusResult = {
	status: "inactive" | "paid" | "due" | "waiting" | "missing";
	paidOn: Date | null;
	paidAmount: number | null;
	priceChange: number | null;
};
type PaymentSource = "bank" | "card";

export type MatchPayment = {
	id: string;
	source: PaymentSource;
	matchKey: string;
	expectedAmount: number;
	expectedDay: number;
	linkedDates: Date[];
};
export type MatchCandidate = {
	id: string;
	source: PaymentSource;
	matchKey: string;
	amount: number;
	date: Date;
};
export type MatchDecision = {
	transactionId: string;
	source: PaymentSource;
	recurringPaymentId: string;
};

export type MessageToSave = {
	role: "user" | "assistant";
	content: Anthropic.MessageParam["content"];
	inputTokens?: number;
	outputTokens?: number;
};

export type PaymentPair = {
	candidate: MatchCandidate;
	payment: MatchPayment;
	occurrence: Date;
	amountDiff: number;
	dayDiff: number;
};
