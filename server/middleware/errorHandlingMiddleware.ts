import type { NextFunction, Response, Request } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { AppError, ValidationError } from "../errors/errors.js";

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
	console.error(err);
	res.status(500).json({
		error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
	});
}
