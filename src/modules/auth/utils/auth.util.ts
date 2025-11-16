import jwt, { SignOptions } from "jsonwebtoken";
const crypto = require("crypto");

export const generateVerificationToken = (): string => {
	return crypto.randomBytes(32).toString("hex");
};

export const generateAccessToken = (userId: number, email: string): string => {
	// implementation for generating JWT access token

	const payload = {
		userId,
		email,
	};
	const secret = process.env.JWT_SECRET || "secret";
	const expireIn = "1h";
	const option: SignOptions = { expiresIn: expireIn };

	return jwt.sign(payload, secret, option);
};

export const generateRefreshToken = (userId: number): string => {
	const payload = { userId };
	const secret = process.env.JWT_REFRESH_SECRET || "refresh_secret";
	const expireIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
	const option: SignOptions = {
		expiresIn: expireIn,
	};

	return jwt.sign(payload, secret, option);
};

export const verifyAccessToken = (token: string): any => {
	const secret = process.env.JWT_SECRET || "secret";
	try {
		const decoded = jwt.verify(token, secret);
		return decoded;
	} catch (error) {
		return null;
	}
};

export const verifyRefreshToken = (token: string): any => {
	const secret = process.env.JWT_REFRESH_SECRET || "refresh_secret";
	try {
		const decoded = jwt.verify(token, secret);
		return decoded;
	} catch (error) {
		return null;
	}
};
