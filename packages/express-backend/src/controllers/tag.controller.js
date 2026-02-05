import { addTag, getTags, removeTagById } from "../services/tag.service.js";
import { removeTagFromClothes } from "../services/cloth.service.js";
import { handleMongoDBError } from "../db.js";

const postTag = async (req, res) => {
  try {
    const tag = await addTag(req.body);
    res.status(201).send(tag);
  } catch (err) {
    return handleMongoDBError(res, err);
  }
};

const getTagsForUser = async (req, res) => {
  try {
    const tags = await getTags(req.params.user_id);
    res.status(200).send(tags);
  } catch (err) {
    return handleMongoDBError(res, err);
  }
};

const deleteTag = async (req, res) => {
  try {
    await removeTagById(req.params.tagId);
    await removeTagFromClothes(req.params.tagId);
    res.status(200).send();
  } catch (err) {
    return handleMongoDBError(res, err);
  }
};

export { postTag, getTagsForUser, deleteTag };
