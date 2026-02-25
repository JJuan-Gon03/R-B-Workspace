import { getByUsername, addUser } from "../services/user.service.js";
import { handleMongoDBError } from "../db.js"

const postUser = async (req, res) => {
  if (!req.body.password || !req.body.username) {
    return res.status(400).json({
      message:
        "yo you need to have username:??? and password:??? in your request",
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
      message: "yo this username is taken lil bro",
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
      message:
        "yo you need to have username:??? and password:??? in your request",
    });
  }

  let user;
  try {
    user = await getByUsername(req.body.username);
  } catch (err) {
    return handleMongoDBError(res, err);
  }

  if (!user) {
    return res.status(400).json({ message: "user doesn't even exist LOL" });
  }

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) {
    return res.status(400).json({
      message:
        "brother if this is really ur account how do u no tknow ur password lmao",
    });
  }

  return res.status(200).send(user._id);
};

export { postUser, login };
