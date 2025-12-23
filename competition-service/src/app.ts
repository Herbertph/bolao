import express from "express";
import teamsRoutes from "./modules/teams/teams.routes.js";
import groupRoutes from "./modules/groups/group.routes.js"
import competitionRoutes from "./modules/competition/competition.routes.js"
import matchesRoutes from "./modules/matches/matches.routes.js"

export const app = express();

app.use(express.json());

app.use("/teams", teamsRoutes);
app.use("/groups", groupRoutes);
app.use("/competition", competitionRoutes);
app.use("/matches", matchesRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));
