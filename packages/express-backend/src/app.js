import express from "express";
import cors from "cors";

import tagRoutes from "./routes/tag.route.js";
import geminiRoutes from "./routes/gemini.route.js";
import clothRoutes from "./routes/cloth.route.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/tags", tagRoutes);
app.use("/wardrobe", clothRoutes);
app.use("/gemini", geminiRoutes);

export { app };
