import { Router } from "express";
import authRouter from "./user.routes";
import statementRouter from "./upload.routes";
import accountRouter from "./account.routes";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();
router.use("/auth", authRouter);
router.use("/statement", statementRouter);
router.use("/account", authMiddleware ,accountRouter);

export default router;
