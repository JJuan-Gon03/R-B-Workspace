import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./db.js";

await connectDB();

const port = 8000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
