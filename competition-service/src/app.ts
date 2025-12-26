import express from "express";
import teamsRoutes from "./modules/teams/teams.routes.js";
import groupRoutes from "./modules/groups/group.routes.js"
import competitionRoutes from "./modules/competition/competition.routes.js"
import matchesRoutes from "./modules/matches/matches.routes.js"
import adminMatchesRoutes from "./modules/matches/admin.matches.routes.js"
import roundsRoutes from "./modules/rounds/rounds.routes.js"
import predictionsRoutes from "./modules/predictions/predictions.routes.js"
import scoringRoutes from "./modules/scoring/scoring.routes.js"

export const app = express();

app.use(express.json());

app.use("/teams", teamsRoutes);
app.use("/groups", groupRoutes);
app.use("/competition", competitionRoutes);
app.use("/matches", matchesRoutes);
app.use("/admin/matches", adminMatchesRoutes);
app.use("/rounds", roundsRoutes);
app.use("/predictions", predictionsRoutes);
app.use("/admin/score", scoringRoutes);
console.log("ADMIN MATCHES ROUTES LOADED");




app.get("/health", (_req, res) => res.json({ ok: true }));
