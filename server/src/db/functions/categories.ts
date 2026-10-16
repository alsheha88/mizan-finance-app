import { PaletteColor, TransactionType } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type {
	CreateCategory,
	UpdateCategory,
} from "../../schema/categoriesSchema";

export const dbGetCategories = async (userId: string) => {
	return await prisma.category.findMany({ where: { userId } });
};
export const dbGetCategory = async (id: string, userId: string) => {
	return await prisma.category.findFirst({ where: { id, userId } });
};
export const dbCreateCategory = async (
	userId: string,
	data: CreateCategory,
) => {
	const color = await pickLeastUsedColor(userId, data.appliesTo);
	return await prisma.category.create({
		data: {
			name: data.name,
			color,
			appliesTo: data.appliesTo,
			userId,
		},
	});
};
export const dbUpdateCategory = async (
	userId: string,
	id: string,
	data: UpdateCategory,
) => {
	const category = Object.fromEntries(
		Object.entries(data).filter(([, v]) => v !== undefined),
	);
	return await prisma.category.updateManyAndReturn({
		where: { id, userId },
		data: {
			...category,
			userId,
		},
	});
};
export const dbDeleteCategory = async (userId: string, id: string) => {
	return await prisma.category.deleteMany({
		where: { id, userId },
	});
};

export const pickLeastUsedColor = async (
	userId: string,
	appliesTo: TransactionType,
) => {
	const rows = await prisma.category.groupBy({
		where: { userId, appliesTo },
		by: ["color"],
		_count: { color: true },
	});
	const counts = new Map(
		rows.map(
			({ color, _count }: { color: PaletteColor; _count: { color: number } }) => [
				color,
				_count.color,
			],
		),
	);
	let bestColor: PaletteColor = "mint";
	let bestCount = Infinity;
	for (const color of Object.values(PaletteColor)) {
		const colorCount = counts.get(color) ?? 0;
		if (colorCount < bestCount) {
			bestColor = color;
			bestCount = colorCount;
		}
	}

	return bestColor;
};
