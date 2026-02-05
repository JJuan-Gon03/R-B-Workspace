import express from "express";
import { getGeminiResponse } from "../controllers/gemini.controller.js";

const router = express.Router();

router.get("/response/:user_id/:text", getGeminiResponse);

export default router;
