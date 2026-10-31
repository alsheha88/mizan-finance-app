import { api } from "@/lib/api";
import type {
	Category,
	CreateCategoryData,
	UpdateCategory,
} from "@/schema/categoriesSchema";
import type { IdParams } from "@/schema/userSchema";

type EditCategory = {
	params: IdParams;
	data: UpdateCategory;
};

export const getCategories = async () => {
	const res = await api.get<{ data: { categories: Category[] } }>(
		"/api/categories",
	);

	return res.data.data.categories;
};
export const getCategory = async (param: IdParams) => {
	const res = await api.get<{ data: { category: Category } }>(
		`/api/categories/${param.id}`,
	);

	return res.data.data.category;
};

export const createCategory = async (data: CreateCategoryData) => {
	const res = await api.post<{ data: { category: Category } }>(
		"/api/categories",
		data,
	);

	return res.data.data.category;
};

export const editCategory = async ({ params, data }: EditCategory) => {
	const res = await api.patch<{ data: { category: Category } }>(
		`/api/categories/${params.id}`,
		data,
	);

	return res.data.data.category;
};
export const deleteCategory = async (param: IdParams) => {
	const res = await api.delete<{ data: { message: string } }>(
		`/api/categories/${param.id}`,
	);

	return res.data.data.message;
};
