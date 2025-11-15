const crypto = require("crypto");

export const generateVerificationToken = (): string => {
	return crypto.randomBytes(32).toString("hex");
};
