import type { NextFunction, Response, Request } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { AppError, ValidationError } from "../errors/errors.js";
import multer from "multer";

export function errorHandler(
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (err instanceof ValidationError) {
		res.status(err.statusCode).json({
			error: { code: err.code, message: err.message, details: err.details },
		});

		return;
	}
	if (err instanceof AppError) {
		res
			.status(err.statusCode)
			.json({ error: { code: err.code, message: err.message } });

		return;
	}

	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		if (err.code === "P2002") {
			res.status(409).json({
				error: {
					code: "CONFLICT",
					message: "A record with this value already exists",
				},
			});
			return;
		}
		if (err.code === "P2025") {
			res.status(404).json({
				error: { code: "NOT_FOUND", message: "Record not found" },
			});
			return;
		}
	}

	if (err instanceof multer.MulterError) {
		if (err.code === "LIMIT_FILE_SIZE") {
			res.status(413).json({
				error: {
					code: "FILE_TOO_LARGE",
					message: "File too large. Maximum 10 MB.",
				},
			});
			return;
		}
		res.status(400).json({
			error: { code: "UPLOAD_ERROR", message: err.message },
		});
		return;
	}
	console.error(err);
	res.status(500).json({
		error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
	});
}
