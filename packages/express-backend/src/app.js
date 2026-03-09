import express from "express";
import cors from "cors";

import tagRoutes from "./routes/tag.route.js";
import geminiRoutes from "./routes/gemini.route.js";
import clothRoutes from "./routes/cloth.route.js";
import userRoutes from "./routes/user.route.js";
import listingRoutes from "./routes/listing.route.js";
import savedRoutes from "./routes/saved.route.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/tags", tagRoutes);
app.use("/wardrobe", clothRoutes);
app.use("/gemini", geminiRoutes);
app.use("/users", userRoutes);
app.use("/listings", listingRoutes);
app.use("/saved", savedRoutes);

export { app };
