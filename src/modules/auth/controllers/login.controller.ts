import bcrypt from "bcrypt";
import { log } from "@utils/logger";
import { Request, Response } from "express";
import { loginValidation } from "../request/validation";
import prisma from "@config/db";
import { generateAccessToken, generateRefreshToken } from "../utils/auth.util";

export const login = async (req: Request, res: Response) => {
	try {
		// validation
		if (!req.body) {
			return res.status(400).json({ message: "Invalid request" });
		}
		const { email, password } = req.body;
		if (loginValidation(email, password).valid === false) {
			return res
				.status(400)
				.json({ message: loginValidation(email, password).message });
		}

		// logic to authenticate user goes here
		const user = await prisma.user.findFirst({
			where: { email: email.toLowerCase() },
		});

		if (!user) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		// verify password

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		if (user.isVerified === false) {
			return res
				.status(403)
				.json({ message: "Please verify your email to login" });
		}

		// generate token
		const accessToken = generateAccessToken(user.id, user.email);
		const refreshToken = generateRefreshToken(user.id);

		await prisma.user.update({
			where: { id: user.id },
			data: { refreshToken: refreshToken },
		});

		return res.status(200).json({
			success: true,
			message: "Login Successful",
			data: {
				id: user.id,
				name: user.name,
				email: user.email,
				isVerified: user.isVerified,
				accessToken,
				refreshToken,
			},
		});
	} catch (error) {
		log.error("Login Error:" + error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};
