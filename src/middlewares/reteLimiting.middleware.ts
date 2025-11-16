const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: "Too many requests, please try again later.",
});

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	message: "Too many login attempts, please try again later.",
});

const registerLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 5,
	message: "Too many registration attempts, please try again later.",
});

const passwordResetLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 5,
	message: "Too many password reset requests, please try again later.",
});

const verificationLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 5,
	message: "Too many verification requests, please try again later.",
});

export {
	apiLimiter,
	authLimiter,
	registerLimiter,
	passwordResetLimiter,
	verificationLimiter,
};
