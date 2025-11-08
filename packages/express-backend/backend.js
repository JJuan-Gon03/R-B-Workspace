import express from "express";
import cors from "cors";
import ai from "./Chatgpt.js";
import wardrobe from "./wardrobe-db.js";
import users from "./users-db.js";
import outfits from "./outfits-db.js";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.post("/outfits/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { name, image } = req.body;
    const outfit = await outfits.addCloth({ user_id, name, image });
    res.status(201).send(outfit);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.delete("/outfits/:outfit_id", async (req, res) => {
  try {
    const { outfit_id } = req.params;
    const result = await outfits.deleteCloth(cloth_id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/wardrobe/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { name, image } = req.body;
    const description = await ai.parse_upload(image);

    const cloth = await wardrobe.addCloth({
      user_id,
      name,
      description,
      image,
    });
    res.status(201).send(cloth);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.delete("/wardrobe/:cloth_id", async (req, res) => {
  try {
    const { cloth_id } = req.params;
    const result = await wardrobe.deleteCloth(cloth_id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const userToAdd = req.body;
    const user = await users.addUser(userToAdd);
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
