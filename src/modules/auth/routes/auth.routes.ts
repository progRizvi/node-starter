import express from "express";
import { register } from "../controllers/register.controller";
import {
	authLimiter,
	registerLimiter,
} from "@middlewares/reteLimiting.middleware";
import { login } from "../controllers/login.controller";
import { verifyToken } from "../controllers/verifyToken.controller";
import { userProfile } from "../controllers/userProfile.controller";
import { authentication } from "@middlewares/authentication";

const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/login", authLimiter, login);
router.get("/verify-email/:token", authLimiter, verifyToken);
router.get("/user-profile", [authLimiter, authentication], userProfile);
export default router;
