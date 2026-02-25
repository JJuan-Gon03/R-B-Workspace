import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "tags" }
);

const User = mongoose.model("User", UserSchema);

export { User };
