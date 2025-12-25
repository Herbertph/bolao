import mongoose from "mongoose";
import app from "./app";


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const PORT = process.env.PORT || 5005;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("MONGO_URL is not defined");
}

mongoose.connect(MONGO_URL).then(() => {
  console.log("Audit DB connected");
  app.listen(PORT, () =>
    console.log(`Audit service running on port ${PORT}`)
  );
});
