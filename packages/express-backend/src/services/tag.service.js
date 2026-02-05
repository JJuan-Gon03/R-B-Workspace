import { Tag } from "../models/tag.model.js";

function getTags(user_id) {
  return Tag.find({ user_id: user_id });
}

function addTag(tag) {
  return Tag.create(tag);
}

function removeTagById(tagId) {
  return Tag.findByIdAndDelete(tagId);
}

export { getTags, addTag, removeTagById };
