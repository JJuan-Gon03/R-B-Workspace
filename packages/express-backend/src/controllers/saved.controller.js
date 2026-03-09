import {
  getSaved as getSavedService,
  saveListing,
  unsaveListing,
} from "../services/saved.service.js";
import { handleMongoDBError } from "../db.js";

const getSaved = async (req, res) => {
  try {
    const saved = await getSavedService(req.params.user_id);
    res.status(200).send(saved);
  } catch (err) {
    return handleMongoDBError(res, err);
  }
};

const postSaved = async (req, res) => {
  try {
    const saved = await saveListing(req.body.user_id, req.body.listing_id);
    return res.status(201).send(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({ message: "already saved" });
    }
    return handleMongoDBError(res, err);
  }
};

const deleteSaved = async (req, res) => {
  try {
    await unsaveListing(req.params.user_id, req.params.listing_id);
    res.status(200).send();
  } catch (err) {
    return handleMongoDBError(res, err);
  }
};

export { getSaved, postSaved, deleteSaved };
