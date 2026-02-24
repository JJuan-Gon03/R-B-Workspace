import "dotenv/config";
import mongoose from "mongoose";

mongoose.connection.on("connected", () => console.log("✅ Mongo connected"));
mongoose.connection.on("error", (err) => console.error("❌ Mongo error:", err));
mongoose.connection.on("disconnected", () =>
  console.log("⚠️ Mongo disconnected")
);

mongoose.set("debug", true);
// Fail immediately instead of buffering operations for 10s
mongoose.set("bufferCommands", false);

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    throw err;
  }
}

export function handleMongoDBError(res, err) {
  console.log(err);

  if (err?.name === "ValidationError") {
    return res.status(422).json({ message: "db object validation error" });
  }
  if (err?.name === "CastError") {
    return res.status(400).json({ message: "Invalid id" });
  }

  return res.status(500).json({ message: "db error" });
}
