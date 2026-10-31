import express from "express";
import {
	editTransaction,
	getTransaction,
	getTransactions,
} from "../controllers/transactions";

const router = express.Router();

router.get("/", getTransactions);
router.get("/:id", getTransaction);
router.patch("/:id", editTransaction);

export default router;
