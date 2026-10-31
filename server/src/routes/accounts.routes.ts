import express from "express";
import {
	createAccount,
	getAccountsList,
	editAccount,
	getAccount,
	updateAccountActiveStatus

} from "../controllers/accounts";
import { deleteTransactions } from "../controllers/transactions";

const router = express.Router();

router.get("/", getAccountsList);
router.get("/:id", getAccount);
router.post("/", createAccount);
router.patch("/:id/active", updateAccountActiveStatus);
router.patch("/:id", editAccount);
router.delete("/:id/transactions", deleteTransactions);

export default router;