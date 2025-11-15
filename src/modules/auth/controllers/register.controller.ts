import { Request, Response } from "express";
import { registerValidation } from "../request/validation";
import bcrypt from "bcrypt";
import prisma from "@config/db";
import { generateVerificationToken } from "../utils/auth.util";
import { log } from "@utils/logger";
import { sendMails } from "@services/sendMailSerivice";

interface RegisterBody {
	name: string;
	email: string;
	password: string;
}
const saltRounds = process.env.BCRYPT_SALT_ROUNDS
	? parseInt(process.env.BCRYPT_SALT_ROUNDS)
	: 10;
export const register = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		if (!req.body) {
			return res.status(400).json({ message: "Request body is missing" });
		}
		const { name, email, password } = req.body as RegisterBody;

		if ((await registerValidation(name, email, password)).valid === false) {
			return res.status(400).json({
				message: (await registerValidation(name, email, password)).message,
			});
		}

		const str = generateVerificationToken();
		// store the user in the database;
		const lowerEmail = email.toLowerCase();
		const hashedPass = await bcrypt.hash(password, saltRounds);
		await prisma.user.create({
			data: {
				name,
				email: lowerEmail,
				password: hashedPass,
				isVerified: false,
				verificationToken: str,
			},
		});

		// sending verification email
		try {
			sendMails(
				lowerEmail,
				"Verify your email",
				`Please verify your email by clicking the link: ${process.env.FRONTEND_URL}/verify-email?token=${str}&email=${lowerEmail}`,
				`<p>Please verify your email by clicking the link: <a href="${process.env.FRONTEND_URL}/verify-email?token=${str}&email=${lowerEmail}">Verify Email</a></p>`
			);

			log.info("Verification email sent to " + lowerEmail);
		} catch (error) {
			console.error("Error sending verification email:", error);
			log.error("Error sending verification email: " + error);
		}
	} catch (error) {
		console.error("Error in register controller:", error);
		log.error("Error in register controller: " + error);
		return res.status(500).json({ message: "Internal server error" });
	}

	return res.status(201).json({ message: "User registered successfully" });
};
