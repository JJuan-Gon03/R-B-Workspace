import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./db.js";

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`REST API is listening on port ${port}.`);
    });
  })
  .catch((err) => {
    console.error("❌ Startup failed:", err);
    // Crash so Azure restarts and you see the real error in Log Stream
    process.exit(1);
  });
