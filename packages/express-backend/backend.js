import express from "express";
import cors from "cors";
import ai_response from "./Chatgpt.js"

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.get("/generate_response", (req, res) => {
    res.send(ai_response())
});