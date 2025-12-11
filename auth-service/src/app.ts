import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import rateLimit from "express-rate-limit";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/auth", authRoutes);
app.use(rateLimit({
    windowMs: 60_000,
  max: 100,
  message: "Too many requests from this IP, please try again later"
}))

export default app;
