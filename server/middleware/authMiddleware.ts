import type { RequestHandler } from "express";
import { UnauthorizedError } from "../errors/errors.js";
import { verifyToken } from "../src/lib/authHelpers.js";
import type { JwtPayload } from "jsonwebtoken";

export const authMiddleware: RequestHandler = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer "))
		throw new UnauthorizedError("No token provided");

	const token = authHeader.slice(7);

	let payload: JwtPayload;
	try {
		payload = verifyToken(token);
	} catch {
		throw new UnauthorizedError("Invalid or expired token");
	}

	req.user = { id: payload.userId };

	next();
};
