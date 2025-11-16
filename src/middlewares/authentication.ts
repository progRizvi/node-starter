// authentication middleware
import prisma from "@config/db";
import { log } from "@utils/logger";

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
	userId: string;
	email: string;
}

export const authentication = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			res
				.status(401)
				.json({ success: false, message: "Unauthorized: No token provided" });
			return;
		}

		const token = authHeader.substring(7);

		// token verification

		let decoded: JwtPayload;
		try {
			decoded = jwt.verify(
				token,
				process.env.JWT_SECRET || "secret"
			) as JwtPayload;
		} catch (error) {
			res.status(401).json({ message: "Unauthorized: Invalid token" });
			return;
		}

		const user = await prisma.user.findFirst({
			where: { id: parseInt(decoded.userId) },
			select: { id: true, email: true, name: true, isVerified: true },
		});

		if (!user) {
			res
				.status(401)
				.json({ success: false, message: "Unauthorized: User not found" });
			return;
		}

		if (user.isVerified === false) {
			res.status(403).json({
				success: false,
				message: "Please verify your email to access this resource",
			});
			return;
		}

		// attach user object to the request
		(req as Request & { user?: typeof user }).user = user;

		next();
	} catch (error) {
		log.error("Authentication Middleware Error: " + error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
