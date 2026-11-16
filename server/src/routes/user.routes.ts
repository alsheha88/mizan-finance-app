import express from "express";
import {
	login,
	logout,
	refresh,
	signup,
	getUser,
	editUser,
	deleteUser,
} from "../controllers/user";
import { authMiddleware } from "../../middleware/authMiddleware";
import { loginRateLimit, signupRateLimit } from "../../middleware/rateLimiter";

const router = express.Router();

router.post("/login", loginRateLimit , login);
router.post("/signup", signupRateLimit , signup);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", authMiddleware, getUser);
router.patch("/me", authMiddleware, editUser);
router.delete("/me", authMiddleware, deleteUser);

export default router;
// router.get("/verify-email", verifyEmail);
// router.get("/user/me", authMiddleware, getUser);
