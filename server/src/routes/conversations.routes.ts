import express from "express";
import { chat, getConversation, listConversations } from "../controllers/conversations";

const router = express.Router();

router.get("/conversations", listConversations);
router.get("/conversations/:id", getConversation);
router.post("/chat", chat);

export default router;
