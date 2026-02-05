import mongoose from "mongoose";

mongoose.set("debug", true);
mongoose
  .connect("mongodb://localhost:27017/randb", {})
  .catch((error) => console.log("error connecting to mongodb:\n", error));

function handleMongoDBError(res, err) {
  console.log(err);
  if (err?.name === "ValidationError") {
    return res.status(422).json({ message: "db object validation error" });
  }
  if (err?.name === "CastError") {
    return res.status(400).json({ message: "Invalid id" });
  }
  return res.status(500).json({ message: "db error" });
}

export {handleMongoDBError}
