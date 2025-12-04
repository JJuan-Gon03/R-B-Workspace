import mongoose from "mongoose";

const PrefSchema = new mongoose.Schema(
  {
    preferences: {
      type: String,
      required: true,
      trim: true,
    },
    user_id: { type: Number, required: true },
  },
  { collection: "preferences" },
);

const Pref = mongoose.model("Pref", PrefSchema);

mongoose.set("debug", true);
mongoose
  .connect("mongodb://localhost:27017/randb", {})
  .catch((error) => console.log("error connecting to mongodb:\n", error));

async function getPreferences(user_id) {
  return Pref.findOne({ user_id: user_id });
}

async function updatePreferences(pref) {
  const existing = await Pref.findOne({ user_id: pref.user_id });
  if (!existing) {
    return Pref.create(pref).catch((error) =>
      console.log(`error creating pref: ${pref}. error:\n`, error),
    );
  }
  return Pref.updateOne({ user_id: pref.user_id }, { $set: pref });
}

export default { getPreferences, updatePreferences };
