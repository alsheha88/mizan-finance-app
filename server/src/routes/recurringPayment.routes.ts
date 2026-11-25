import express from "express";
import {
	createRecurringPayment,
	deleteRecurringPayment,
	getRecurringPayments,
	linkTransaction,
	unlinkTransaction,
	updateRecurringPayment,
} from "../controllers/recurringPayment";

const router = express.Router();

router.get("/", getRecurringPayments);
router.post("/", createRecurringPayment);
router.post("/unlink", unlinkTransaction);
router.patch("/:id", updateRecurringPayment);
router.delete("/:id", deleteRecurringPayment);
router.post("/:id/link", linkTransaction);

export default router;
