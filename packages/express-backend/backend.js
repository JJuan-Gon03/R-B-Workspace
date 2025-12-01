import express from "express";
import cors from "cors";
import gemini from "./gemini.js";
import wardrobe from "./wardrobe.js";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("hi");
});

app.get("/gemini/response/:text", async (req, res) => {
  console.log("get /response/:text");

  const text = req.params.text;
  const reply = await gemini.main(text);

  console.log(`exiting get /response/:text with response: ${reply}`);
  res.status(200).send(reply);
});

app.get("/gemini/parse_cloth/:img_url", async (req, res) => {
  console.log("get /gemini/parse_cloth/:img_url");

  const img_url = req.params.img_url;
  const reply = await gemini.parse_cloth(img_url);

  console.log(
    `exiting get /gemini/parse_cloth/:img_url with response: ${reply}`
  );
  res.status(200).send(reply);
});

app.post("/gemini/buildOutfit/:user_id", async (req, res) => {
  console.log("get /gemini/buildOutfit/:user_id");

  const { preferences } = req.body;
  const wd = await wardrobe.getWardrobe(req.params.user_id);
  const reply = await gemini.buildOutfit(wd, preferences);

  console.log(`exiting get /gemini/buildOutfit/:user_id with response`);
  res.status(200).send(reply);
});

app.post("/wardrobe", async (req, res) => {
  console.log("post /wardrobe");

  wardrobe.addCloth(req.body);

  console.log("exiting post /wardrobe with no response");
  res.status(201).send();
});

app.get("/wardrobe/:user_id", async (req, res) => {
  console.log("get /wardrobe/:user_id");

  const wd = await wardrobe.getWardrobe(req.params.user_id);

  console.log("exiting get/wardrobe/:user_id with wardrobe");
  res.status(201).send(wd);
});
