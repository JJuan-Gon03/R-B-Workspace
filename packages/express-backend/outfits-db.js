import mongoose from "mongoose";
import outfitModel from "./outfit.js"

mongoose.set("debug", true);

mongoose
  .connect("mongodb://localhost:27017/outfits", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

function addOutfit(outfit)
{
  const outfitToAdd = new outfitModel(outfit);
  const promise = outfitToAdd.save();
  return promise;
}

function deleteOutfit(id)
{
  return outfitModel.findByIdAndDelete(id);
}

export default{addOutfit,deleteOutfit};
