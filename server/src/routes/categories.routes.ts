import express from "express";
import {
	getCategories,
	getCategory,
	createCategory,
	editCategory,
	deleteCategory,
} from "../controllers/categories";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", createCategory);
router.patch("/:id", editCategory);
router.delete("/:id", deleteCategory);

export default router;
