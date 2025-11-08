import mongoose from "mongoose";
import clothModel from "./cloth.js"

mongoose.set("debug", true);

mongoose
  .connect("mongodb://localhost:27017/wardrobe", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

function addCloth(cloth)
{
  const clothToAdd = new clothModel(cloth);
  const promise = clothToAdd.save();
  return promise;
}

function deleteCloth(id)
{
  return clothModel.findByIdAndDelete(id);
}