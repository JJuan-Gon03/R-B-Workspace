import mongoose from "mongoose";

const ClothSchema = new mongoose.Schema(
  {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
  },
  { collection: "wardrobe" }
);

const Cloth = mongoose.model("Cloth", ClothSchema);

export default Cloth;