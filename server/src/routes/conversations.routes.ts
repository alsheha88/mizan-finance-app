import express from "express";
import { chat, getConversation, listConversations } from "../controllers/conversations";
import { chatRateLimit } from "../../middleware/rateLimiter";

const router = express.Router();

router.get("/conversations", listConversations);
router.get("/conversations/:id", getConversation);
router.post("/chat", chatRateLimit, chat);

export default router;
