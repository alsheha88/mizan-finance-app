import express from "express";
import multer from "multer";
import { uploadStatement } from "../controllers/uploadStatement";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
});


router.post("/upload", authMiddleware ,upload.single("statement"), uploadStatement)

export default router;