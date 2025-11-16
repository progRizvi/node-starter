import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { routes } from "./routes";
import { apiLimiter } from "@middlewares/reteLimiting.middleware";
import helmet from "helmet";
import morgan from "morgan";
import { log } from "@utils/logger";

dotenv.config();

const app = express();
app.use(helmet());
app.use(morgan("combined"));
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:3000",
		credentials: true,
	})
);
app.use(
	express.json({
		limit: "10mb",
	})
);

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(apiLimiter);
// api routes
app.use("/api", routes);

// 404 route handler
app.use((req: Request, res: Response) => {
	res.status(404).json({
		message: "Route not found",
		success: false,
	});
});

// global error handler

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error("Error:", err);
	log.error(`Error: ${err.message}`);
	res.status(500).json({
		message: "Internal Server Error",
		success: false,
	});
});

export default app;
