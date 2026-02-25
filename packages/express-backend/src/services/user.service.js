import { User } from "../models/user.model.js";

function getByUsername(username) {
  return User.find({ username: username });
}

function addUser(user) {
  return User.create(user);
}

export { getByUsername, addUser };
