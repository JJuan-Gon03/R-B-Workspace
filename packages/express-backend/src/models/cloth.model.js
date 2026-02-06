import mongoose from "mongoose";

const ClothSchema = new mongoose.Schema(
  {
    user_id: { type: Number, required: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
    type: { type: String, required: true },
    tags: { type: [mongoose.Schema.Types.ObjectId], required: true },
    description: { type: String, required: true },
    img_url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { collection: "wardrobe" }
);

const Cloth = mongoose.model("Cloth", ClothSchema);

export { Cloth };
