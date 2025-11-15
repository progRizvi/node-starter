import express from "express";
const app = express();
import authRouter from "./modules/auth/routes/auth.routes";

// all routes goes here

const router = express.Router();

// base route
router.get("/", (req, res) => {
	res.send("Hello World!");
});

router.use("/", authRouter);

// export app as routes
export { router as routes };
