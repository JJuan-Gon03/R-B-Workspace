import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
  {
    user_id:{type:Number,required:true},
    name:{type:String,required:true},
  },
  { collection: "tags" }
);

const Tag = mongoose.model("Tag", TagSchema);

mongoose.set("debug", true);
mongoose
  .connect("mongodb://localhost:27017/randb", {})
  .catch((error) => console.log("error connecting to mongodb:\n", error));

function getTags(user_id) {
  return Tag.find({ user_id: user_id }).catch((error) =>
    console.log(`error finding user with user_id: ${user_id}. error:\n`, error)
  );
}

function addTag(tag) {
  return Tag.create(tag).catch((error) =>
    console.log(`error creating cloth: ${cloth}. error:\n`, error)
  );
}

function removeTagById(tagId) {
  return Tag.findByIdAndDelete(tagId).catch(error =>
    console.log("error removing tag:", error)
  );
}


export default { getTags, addTag, removeTagById };
