import express from "express";
import {
	createAccount,
	getAccountsList,
	editAccount,
	getAccount,
	updateAccountActiveStatus

} from "../controllers/accounts";

const router = express.Router();

router.get("/", getAccountsList);
router.get("/:id", getAccount);
router.post("/", createAccount);
router.patch("/:id/active", updateAccountActiveStatus);
router.patch("/:id", editAccount);

export default router;