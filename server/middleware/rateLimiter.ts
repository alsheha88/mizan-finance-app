import { rateLimit } from "express-rate-limit";

export const loginRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 10,
	message: {
		error: {
			code: "RATE_LIMITED",
			message: "Too many attempts, please try again later",
		},
	},
	legacyHeaders: false,
	standardHeaders: "draft-8",
});
export const signupRateLimit = rateLimit({
	windowMs: 60 * 60 * 1000,
	limit: 5,
	message: {
		error: {
			code: "RATE_LIMITED",
			message: "Too many attempts, please try again later",
		},
	},
	legacyHeaders: false,
	standardHeaders: "draft-8",
});
export const chatRateLimit = rateLimit({
	windowMs: 60 * 60 * 1000,
	limit: 30,
	keyGenerator: (req) => req.user.id,
	message: {
		error: {
			code: "RATE_LIMITED",
			message: "You’ve reached the limit of 30 messages per hour. Please try again later.",
		},
	},
	legacyHeaders: false,
	standardHeaders: "draft-8",
});
