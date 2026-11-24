import express from "express";
import { createRecurringPayment, getRecurringPayments } from "../controllers/recurringPayment";

const router = express.Router();

router.post("/", createRecurringPayment);
router.get("/", getRecurringPayments);

export default router;
