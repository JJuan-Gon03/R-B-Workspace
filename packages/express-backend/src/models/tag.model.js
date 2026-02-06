import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
  {
    user_id: { type: Number, required: true },
    name: { type: String, required: true },
  },
  { collection: "tags" }
);

const Tag = mongoose.model("Tag", TagSchema);

export { Tag };
