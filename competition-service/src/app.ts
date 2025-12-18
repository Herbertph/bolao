import express from "express";
import teamsRoutes from "./modules/teams/teams.routes.js";

export const app = express();

app.use(express.json());

app.use("/teams", teamsRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));
