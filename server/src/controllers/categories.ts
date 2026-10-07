import type { RequestHandler } from "express";
import {
	dbCreateCategory,
	dbDeleteCategory,
	dbGetCategories,
	dbGetCategory,
	dbUpdateCategory,
} from "../db/functions/categories";
import {
	ConflictError,
	NotFoundError,
	ValidationError,
} from "../../errors/errors";
import { idParamsSchema } from "../schema/userSchema";
import {
	createCategorySchema,
	updateCategorySchema,
} from "../schema/categoriesSchema";
import { Prisma } from "../../generated/prisma/client";

export const getCategories: RequestHandler = async (req, res) => {
	const userId = req.user.id;

	const categories = await dbGetCategories(userId);

	res.status(200).json({ data: { categories } });
};
export const getCategory: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate category id",
			parsedId.error.issues,
		);
	const id = parsedId.data.id;

	const category = await dbGetCategory(id, userId);
	if (!category) throw new NotFoundError("No categroies found");

	res.status(200).json({ data: { category } });
};
export const createCategory: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const validateRequest = createCategorySchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Failed to validate input data",
			validateRequest.error.issues,
		);

	try {
		const category = await dbCreateCategory(userId, validateRequest.data);
		res.status(201).json({ data: { category } });
	} catch (err) {
		if (
			err instanceof Prisma.PrismaClientKnownRequestError &&
			err.code === "P2002"
		) {
			console.log((err.meta as any)?.driverAdapterError?.cause?.constraint);
			throw new ConflictError("You already have a category with this name");
		}
		throw err;
	}
};
export const editCategory: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate category id",
			parsedId.error.issues,
		);
	const id = parsedId.data.id;
	const validateRequest = updateCategorySchema.safeParse(req.body);
	if (!validateRequest.success)
		throw new ValidationError(
			"Failed to validate input data",
			validateRequest.error.issues,
		);

	const category = await dbUpdateCategory(userId, id, validateRequest.data);
	if (category.length === 0) throw new NotFoundError("No categroies found");

	res.status(200).json({ data: { category } });
};

export const deleteCategory: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const parsedId = idParamsSchema.safeParse(req.params);
	if (!parsedId.success)
		throw new ValidationError(
			"Failed to validate category id",
			parsedId.error.issues,
		);
	const id = parsedId.data.id;

	const category = await dbDeleteCategory(userId, id);
	if (category.count === 0) throw new NotFoundError("No categories found");

	res.status(200).json({ data: { message: "Category deleted successfully" } });
};
