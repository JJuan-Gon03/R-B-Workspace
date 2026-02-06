import "dotenv/config";

import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { initPassport } from "./services/passport.service.js";

import tagRoutes from "./routes/tag.route.js";
import geminiRoutes from "./routes/gemini.route.js";
import clothRoutes from "./routes/cloth.route.js";
import OauthRouter from "./routes/Oauth.route.js";

const app = express();
app.use(express.json());

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(cookieParser());
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: process.env.NODE_ENV === "production",
//     },
//   })
// );

// initPassport();
// app.use(passport.initialize());
// app.use(passport.session());

app.use("/tags", tagRoutes);
app.use("/wardrobe", clothRoutes);
app.use("/gemini", geminiRoutes);
app.use("/auth", OauthRouter);

export { app };
