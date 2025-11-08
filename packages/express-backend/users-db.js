import mongoose from "mongoose";
import userModel from "./user.js"

mongoose.set("debug", true);

mongoose
  .connect("mongodb://localhost:27017/users_list", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

function addUser(user)
{
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

export default{addUser};
