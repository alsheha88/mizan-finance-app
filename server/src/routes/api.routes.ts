import { Router } from "express";
import authRouter from "./user.routes";
import statementRouter from "./upload.routes";
import accountRouter from "./accounts.routes";
import transactionRouter from "./transactions.routes";
import categoriesRouter from "./categories.routes";
import loansRouter from "./loans.routes";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();
router.use("/auth", authRouter);
router.use("/statement", statementRouter);
router.use("/account", authMiddleware, accountRouter);
router.use("/transactions", authMiddleware, transactionRouter);
router.use("/categories", authMiddleware, categoriesRouter);
router.use("/loans", authMiddleware, loansRouter);

export default router;
