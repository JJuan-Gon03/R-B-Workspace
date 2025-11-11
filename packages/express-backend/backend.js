import express from "express";
import cors from "cors";
import ai from "./bad/Chatgpt.js";
import wardrobe from "./bad/wardrobe-db.js";
import users from "./bad/users-db.js";
import outfits from "./bad/outfits-db.js";
import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import * as dotenv from "dotenv";

dotenv.config();

const upload = multer({dest:"uploads/"});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(
    `hi http://localhost:${port}`
  );
});

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
    const result = await outfits.deleteOutfit(outfit_id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/wardrobe/:user_id", upload.single("file"), async (req, res) => {
  console.log("here");
  try {
    if(!req.file)return res.status(400).send({error:"NO IMAGE"})
    const { user_id } = req.params;
    const { name} = req.body;
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      folder: "wardrobe",
      resource_type: "image",
    });
    const description = await ai.parse_upload(secure_url);
    const cloth = await wardrobe.addCloth({
      user_id,
      name,
      description,
      image:secure_url,
    });
    res.status(201).send(cloth);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/wardrobe", (req, res)=>{
  return wardrobe.getClothes();
})

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
