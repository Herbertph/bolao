import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5003;
const MONGO_URI = process.env.MONGO_URI!;

mongoose.connect(MONGO_URI).then(() => {
  console.log("Audit DB connected");
  app.listen(PORT, () => console.log("Audit service running on", PORT));
});
