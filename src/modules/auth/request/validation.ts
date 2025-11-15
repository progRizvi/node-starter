import prisma from "@config/db";

export const emailValidation = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const passwordValidation = (password: string): boolean => {
	return password.length >= 6;
};

export const nameValidation = (name: string): boolean => {
	return name.trim().length > 0;
};

export const registerValidation = async (
	name: string,
	email: string,
	password: string
): Promise<{ valid: boolean; message?: string }> => {
	if (!name) {
		return { valid: false, message: "Name is required" };
	}
	if (!nameValidation(name)) {
		return { valid: false, message: "Name is required" };
	}
	if (!email) {
		return { valid: false, message: "Email is required" };
	}
	if (!emailValidation(email)) {
		return { valid: false, message: "Email is invalid" };
	}

	// check if email already exists in the database
	const userExists = await prisma.user.findFirst({
		where: { email: email.toLowerCase() },
	});
	if (userExists) {
		return { valid: false, message: "User already exists" };
	}
	if (!password) {
		return { valid: false, message: "Password is required" };
	}
	if (!passwordValidation(password)) {
		return { valid: false, message: "Password must be at least 6 characters" };
	}
	return { valid: true };
};
