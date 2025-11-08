import express from "express";
import cors from "cors";
import ai from "./Chatgpt.js"

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.post("/parse_upload", (req, res) => {
    res.send(ai.parse_upload())
});

app.post("")