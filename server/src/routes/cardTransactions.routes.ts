import express from "express";
import {
	getCardTransaction,
	getCardTransactions,
	editCardTransaction,
	deleteCardTransaction,
} from "../controllers/cards";

const router = express.Router();

router.get("/", getCardTransactions);
router.get("/:id", getCardTransaction);
router.patch("/:id", editCardTransaction);
router.delete("/:id", deleteCardTransaction);

export default router;
