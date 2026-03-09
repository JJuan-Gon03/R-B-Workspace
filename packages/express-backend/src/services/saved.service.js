import { Saved } from "../models/saved.model.js";

function getSaved(user_id) {
  return Saved.find({ user_id }).populate("listing_id").sort({ savedAt: -1 });
}

function saveListing(user_id, listing_id) {
  return Saved.create({ user_id, listing_id });
}

function unsaveListing(user_id, listing_id) {
  return Saved.findOneAndDelete({ user_id, listing_id });
}

export { getSaved, saveListing, unsaveListing };
