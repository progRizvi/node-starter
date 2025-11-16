import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { routes } from "./routes";
import { apiLimiter } from "@middlewares/reteLimiting.middleware";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(helmet());
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

app.use(apiLimiter);
// api routes
app.use("/api", routes);

export default app;
