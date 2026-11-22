import express from "express";
import { getDebtPlan } from "../controllers/debtPlanner";
const router = express.Router();

router.get("/", getDebtPlan);

export default router;
