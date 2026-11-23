import express from "express";
import { createRecurringPayment } from "../controllers/recurringPayment";

const router = express.Router();

router.post("/", createRecurringPayment);

export default router;
