import {
  getClothesByUserId,
  addCloth,
  removeClothById,
  getPublicId,
} from "../services/cloth.service.js";
import { parse_cloth } from "../services/gemini.service.js";
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
  const clothId = req.params.clothId;
  let publicId;

  try {
    publicId = await getPublicId(clothId);
  } catch (err) {
    return handleMongoDBError(res, err);
  }

  try {
    await delete_image_from_cloudinary(publicId);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "error deleting image from cloudinary" });
  }

  try {
    await removeClothById(clothId);
  } catch (err) {
    return handleMongoDBError(res, err);
  }

  res.status(200).send();
};

export { postCloth, getClothes, deleteCloth };
