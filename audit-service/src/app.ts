import express from "express";
import cors from "cors";
import helmet from "helmet";
import auditRoutes from "./routes/audit.routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/audit", auditRoutes);

export default app;
