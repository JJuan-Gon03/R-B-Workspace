import express from "express";
import cors from "cors";
import gemini from "./gemini.js";
import wardrobe from "./wardrobe.js";
import tags from "./tags.js"

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

app.get("/gemini/response/:user_id/:text", async (req, res) => {
  const text = req.params.text;
  const user_id = req.params.user_id;
  const reply = await gemini.main(text, user_id);
  res.status(200).json(reply);
});

app.get("/gemini/parse_cloth/:img_url", async (req, res) => {
  const img_url = req.params.img_url;
  const reply = await gemini.parse_cloth(img_url);
  res.status(200).send(reply);
});

app.post("/wardrobe", async (req, res) => {
  wardrobe.addCloth(req.body);
  res.status(201).send();
});

app.get("/wardrobe/:user_id", async (req, res) => {
  const wd = await wardrobe.getWardrobe(req.params.user_id);
  res.status(201).send(wd);
});

app.delete("/wardrobe/:clothId", async (req, res) => {
    await wardrobe.removeClothById(req.params.clothId);
    res.status(200).send();
});

app.post("/tags", async (req, res) => {
  tags.addTag(req.body);
  res.status(201).send();
});

app.get("/tags/:user_id", async (req, res) => {
  const ts = await tags.getTags(req.params.user_id);
  res.status(200).send(ts);
});

app.delete("/tags/:tagId", async (req, res) => {
    await tags.removeTagById(req.params.tagId);
    res.status(200).send();
});


