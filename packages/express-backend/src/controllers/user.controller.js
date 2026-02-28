import { getByUsername, addUser } from "../services/user.service.js";
import { handleMongoDBError } from "../db.js";
import bcrypt from "bcrypt";

const postUser = async (req, res) => {
  if (!req.body.password || !req.body.username) {
    return res.status(400).json({
      name: "invalid request",
      message: "request body: {username: String, password: String}",
    });
  }

  let user;
  try {
    user = await getByUsername(req.body.username);
  } catch (err) {
    return handleMongoDBError(res, err);
  }

  if (user) {
    return res.status(409).json({
      name: "invalud username",
      message: "username has already been taken",
    });
  }

  const hashedPass = await bcrypt.hash(req.body.password, 10);

  try {
    user = await addUser({
      username: req.body.username,
      password: hashedPass,
    });
  } catch (err) {
    return handleMongoDBError(res, err);
  }

  res.status(201).send(user._id);
};

const login = async (req, res) => {
  if (!req.body.password || !req.body.username) {
    return res.status(400).json({
      name: "invalid request",
      message: "request body: {username: String, password: String}",
    });
  }

  let user;
  try {
    user = await getByUsername(req.body.username);
  } catch (err) {
    return handleMongoDBError(res, err);
  }

  if (!user) {
    return res.status(400).json({ name: "invalid username", message: "username not associated with an account" });
  }

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) {
    return res.status(400).json({
      name:"invalid password",
      message:
        "wrong password",
    });
  }

  return res.status(200).send(user._id);
};

export { postUser, login };
