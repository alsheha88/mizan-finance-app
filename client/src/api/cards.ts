import { api } from "@/lib/api";
import type {
	CreateCardData,
	CreditCard,
	UpdateCardData,
} from "@/schema/creditCardsSchema";
import type { IdParams } from "@/schema/userSchema";

type EditCard = {
	params: IdParams;
	data: UpdateCardData;
};

export const getCards = async () => {
	const res = await api.get<{ data: { cards: CreditCard[] } }>("/api/cards");

	return res.data.data.cards;
};

export const getCard = async (params: IdParams) => {
	const res = await api.get<{ data: { card: CreditCard } }>(
		`/api/cards/${params.id}`,
	);

	return res.data.data.card;
};

export const createCard = async (data: CreateCardData) => {
	const res = await api.post<{ data: { card: CreditCard } }>(
		"/api/cards",
		data,
	);

	return res.data.data.card;
};

export const editCard = async ({ params, data }: EditCard) => {
	const res = await api.patch<{ data: { card: CreditCard } }>(
		`/api/cards/${params.id}`,
		data,
	);

	return res.data.data.card;
};

export const deleteCard = async (params: IdParams) => {
	const res = await api.delete<{ data: { message: string } }>(
		`/api/cards/${params.id}`,
	);

	return res.data.data.message;
};
