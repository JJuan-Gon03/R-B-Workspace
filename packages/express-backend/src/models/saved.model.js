import mongoose from "mongoose";

const SavedSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    savedAt: { type: Date, default: Date.now },
  },
  { collection: "saved" }
);

SavedSchema.index({ user_id: 1, listing_id: 1 }, { unique: true });

const Saved = mongoose.model("Saved", SavedSchema);
export { Saved };
