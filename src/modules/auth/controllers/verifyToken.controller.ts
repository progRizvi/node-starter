import prisma from "@config/db";
import { log } from "@utils/logger";
import { Request, Response } from "express";

export const verifyToken = async (req: Request, res: Response) => {
	const token = req.params.token;
	if (!token) {
		return res.status(400).json({ message: "Token is missing" });
	}

	try {
		const user = await prisma.user.findFirst({
			where: {
				verificationToken: token,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "Invalid token" });
		}
		await prisma.user.update({
			where: { id: user.id },
			data: {
				isVerified: true,
				verificationToken: null,
			},
		});
		return res.status(200).json({ message: "Email verified successfully" });
	} catch (error) {
		log.error("Error verifying token: " + error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};
