import "dotenv/config";
import mongoose from "mongoose";

mongoose.set("debug", true);

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/randb";

async function connectDB() {
  mongoose
    .connect(MONGODB_URI, {})
    .connect("mongodb://localhost:27017/randb", {})
    .catch((error) => console.log("error connecting to mongodb:\n", error));
}