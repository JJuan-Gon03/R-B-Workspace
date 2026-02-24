import { app } from "./app.js";
import { connectDB } from "./db.js";

await connectDB();

const port = 8000;
app.listen(process.env.PORT || port, () => {
  console.log("REST API is listening.");
});
