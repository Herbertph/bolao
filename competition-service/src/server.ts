import "dotenv/config";
import { app } from "./app.js";

const PORT = Number(process.env.PORT ?? 5002);

app.listen(PORT, () => {
  console.log(`Competition service running on port ${PORT}`);
});
