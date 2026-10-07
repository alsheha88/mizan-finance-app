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
	return await prisma.category.create({
		data: {
			name: data.name,
			color: data.color,
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
