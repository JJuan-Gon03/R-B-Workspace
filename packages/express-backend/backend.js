import express from "express";
import cors from "cors";
import gemini from "./gemini.js";
import wardrobe from "./wardrobe.js";
import tags from "./tags.js";

function handleMongoDBError(res, err) {
  console.log(err);
  if (err?.name === "ValidationError") {
    return res.status(422).json({ message: "db object validation error" });
  }
  if (err?.name === "CastError") {
    return res.status(400).json({ message: "Invalid id" });
  }
  return res.status(500).json({ message: "db error" });
}

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

app.get("/gemini/response/:user_id/:text", async (req, res) => {
  try {
    const text = req.params.text;
    const user_id = req.params.user_id;
    const reply = await gemini.main(text, user_id);
    return res.status(200).json(reply);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "error retrieving response",
    });
  }
});

app.post("/wardrobe", async (req, res) => {
  try {
    const description = await gemini.parse_cloth(req.body.img_url);
    req.body.description = description;
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "error parsing image to upload to wardrobe" });
  }

  try {
    await wardrobe.addCloth(req.body);
  } catch (err) {
    return handleMongoDBError(res, err);
  }

  try {
    gemini.main(
      `The user has just uploaded a new item to their wardrobe: ${JSON.stringify(req.body)}. Take note of this. There is no need to respond.`,
      req.body.user_id
    );
  } catch (err) {
    return res
      .status(500)
      .json({ message: "error sending uploaded image to gemini chat" });
  }

  return res.status(201).send();
});

app.get("/wardrobe/:user_id", async (req, res) => {
  try {
    const wd = await wardrobe.getWardrobe(req.params.user_id);
    res.status(201).send(wd);
  } catch (err) {
    return handleMongoDBError(res, err);
  }
});

app.delete("/wardrobe/:clothId", async (req, res) => {
  try {
    await wardrobe.removeClothById(req.params.clothId);
    res.status(200).send();
  } catch (err) {
    return handleMongoDBError(res, err);
  }
});

app.post("/tags", async (req, res) => {
  try {
    await tags.addTag(req.body);
    res.status(201).send();
  } catch (err) {
    return handleMongoDBError(res, err);
  }
});

app.get("/tags/:user_id", async (req, res) => {
  try {
    const ts = await tags.getTags(req.params.user_id);
    res.status(200).send(ts);
  } catch (err) {
    return handleMongoDBError(res, err);
  }
});

app.delete("/tags/:tagId", async (req, res) => {
  try {
    await tags.removeTagById(req.params.tagId);
    res.status(200).send();
  } catch (err) {
    return handleMongoDBError(res, err);
  }
});
