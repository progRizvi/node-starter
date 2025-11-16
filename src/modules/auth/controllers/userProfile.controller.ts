import { Request, Response } from "express";

export const userProfile = async (req: Request, res: Response) => {
	console.log("user" + req.user);

	return res.status(200).json({
		success: true,
		message: "User profile fetched successfully",
		data: req.user,
	});
};
