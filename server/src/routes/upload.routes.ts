import express from "express";
import multer from "multer";
import {
	uploadAccountStatement,
	uploadCardStatement,
} from "../controllers/uploadStatement";
import { authMiddleware } from "../../middleware/authMiddleware";
import { ValidationError } from "../../errors/errors";

const router = express.Router();

export const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 10 * 1024 * 1024,
		files: 1,
	},
	fileFilter: (_req, file, cb) => {
		const isPdf =
			file.mimetype === "application/pdf" ||
			(file.mimetype === "application/octet-stream" &&
				file.originalname.toLowerCase().endsWith(".pdf"));

		if (!isPdf) {
			cb(new ValidationError("Only PDF files are allowed"));
			return;
		}

		cb(null, true);
	},
});

router.post(
	"/upload",
	authMiddleware,
	upload.single("statement"),
	uploadAccountStatement,
);
router.post(
	"/upload-card",
	authMiddleware,
	upload.single("statement"),
	uploadCardStatement,
);

export default router;
