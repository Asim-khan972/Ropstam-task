import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRouter } from "./routes/authRoutes";
import { carRouter } from "./routes/carRoutes";
import { categoryRouter } from "./routes/categoryRoutes";
import morgan from "morgan";
import sanitizeInput from "./middlewares/xssMiddleware";
const app = express();
// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(sanitizeInput);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/cars", carRouter);
app.use("/api/categories", categoryRouter);

export default app;
