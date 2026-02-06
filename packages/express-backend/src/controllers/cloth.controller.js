import {
  getClothesByUserId,
  addCloth,
  removeClothById,
} from "../services/cloth.service.js";
import { parse_cloth, main } from "../services/gemini.service.js";
import { handleMongoDBError } from "../db.js";
import { delete_image_from_cloudinary } from "../services/cloudinary.service.js";

const postCloth = async (req, res) => {
  try {
    const description = await parse_cloth(req.body.img_url);
    if (description === "INVALID") {
      return res.status(400).json({ message: "invalid image for upload" });
    }
    req.body.description = description;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }

  try {
    await addCloth(req.body);
  } catch (err) {
    return handleMongoDBError(res, err);
  }

  try {
    await main(
      `The user has just uploaded a new item to their wardrobe: ${JSON.stringify(req.body)}. Take note of this. There is no need to respond.`,
      req.body.user_id
    );
  } catch (err) {
    return res
      .status(500)
      .json({ message: "error sending uploaded image to gemini chat" });
  }

  return res.status(201).send(req.body);
};

const getClothes = async (req, res) => {
  try {
    const wd = await getClothesByUserId(req.params.user_id);
    res.status(200).send(wd);
  } catch (err) {
    return handleMongoDBError(res, err);
  }
};

const deleteCloth = async (req, res) => {
  let deletedCloth;

  try {
    deletedCloth = await removeClothById(req.params.clothId);
  } catch (err) {
    return handleMongoDBError(res, err);
  }

  if (deleteCloth) {
    try {
      await main(
        `The user has just deleted an item from their wardrobe: ${JSON.stringify(deletedCloth)}. Take note of this. There is no need to respond.`,
        deletedCloth.user_id
      );
    } catch (err) {
      return res
        .status(500)
        .json({ message: "error sending deleted cloth to gemini chat" });
    }

    try {
      await delete_image_from_cloudinary(deletedCloth.public_id);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "error deleting image from cloudinary" });
    }
  }

  res.status(200).send();
};

export { postCloth, getClothes, deleteCloth };
