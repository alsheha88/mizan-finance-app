import express from "express";
import {
	getCreditCard,
	getCreditCards,
	createCreditCard,
	editCreditCard,
	deleteCreditCard,
} from "../controllers/cards";

const router = express.Router();

router.get("/", getCreditCards);
router.get("/:id", getCreditCard);
router.post("/", createCreditCard);
router.patch("/:id", editCreditCard);
router.delete("/:id", deleteCreditCard);

export default router;
