import express from "express";
import {
getLoans,
getLoan,
createLoan,
editLoan,
deleteLoan
} from "../controllers/loans";

const router = express.Router();

router.get("/", getLoans);
router.get("/:id", getLoan);
router.post("/", createLoan);
router.patch("/:id", editLoan);
router.delete("/:id", deleteLoan);

export default router;
