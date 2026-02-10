import { Cloth } from "../models/cloth.model.js";

function getClothesByUserId(user_id) {
  return Cloth.find({ user_id: user_id });
}

function addCloth(cloth) {
  return Cloth.create(cloth);
}

function removeClothById(clothId) {
  return Cloth.findByIdAndDelete(clothId);
}

function removeTagFromClothes(tag_id) {
  return Cloth.updateMany({ tags: tag_id }, { $pull: { tags: tag_id } });
}

async function getPublicId(clothId) {
  const cloth = await Cloth.findById(clothId);
  return cloth.public_id;
}

export { getPublicId, getClothesByUserId, addCloth, removeClothById, removeTagFromClothes };
