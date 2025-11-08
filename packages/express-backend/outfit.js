import mongoose from "mongoose";

const OutfitSchema = new mongoose.Schema(
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
    image: {
        type: String,
        required: true,
        trim: true,
    },
  },
  { collection: "outfits" }
);

const Outfit = mongoose.model("Outfit", UserSchema);

export default Outfit;