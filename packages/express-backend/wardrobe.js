import {mongoose, Schema} from "mongoose";

const ClothSchema = new mongoose.Schema(
  {
    user_id: { type: Number, required: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
    type: { type: String, required: true },
    tags: { type: [Schema.Types.ObjectId], required: true },
    description: { type: String, required: true },
    img_url: { type: String, required: true },
  },
  { collection: "wardrobe" }
);

const Cloth = mongoose.model("Cloth", ClothSchema);

mongoose.set("debug", true);
mongoose
  .connect("mongodb://localhost:27017/randb", {})
  .catch((error) => console.log("error connecting to mongodb:\n", error));

function getWardrobe(user_id) {
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

export default { getWardrobe, addCloth, removeClothById, removeTagFromClothes };
