import express from "express";
import {
	getCardTransaction,
	getCardTransactions,
	editCardTransaction,
} from "../controllers/cards";

const router = express.Router();

router.get("/", getCardTransactions);
router.get("/:id", getCardTransaction);
router.patch("/:id", editCardTransaction);

export default router;
