import {
  getListings as getListingsService,
  addListing,
  getListingsByUser,
  updateListing,
  deleteListing,
} from "../services/listing.service.js";
import { Listing } from "../models/listing.model.js";
import { handleMongoDBError } from "../db.js";

const getListings = async (req, res) => {
  try {
    const listings = await getListingsService();
    res.status(200).send(listings);
  } catch (err) {
    return handleMongoDBError(res, err);
  }
};

const postListing = async (req, res) => {
  let listing;
  try {
    listing = await addListing(req.body);
  } catch (err) {
    return handleMongoDBError(res, err);
  }
  return res.status(201).send(listing);
};

const getUserListings = async (req, res) => {
  try {
    const listings = await getListingsByUser(req.params.user_id);
    res.status(200).send(listings);
  } catch (err) {
    return handleMongoDBError(res, err);
  }
};

const patchListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Not found" });
    if (listing.user_id.toString() !== req.body.user_id)
      return res.status(403).json({ message: "Forbidden" });
    // Strip user_id from the update payload to prevent accidental overwrite
    const { user_id, ...updateData } = req.body;
    const updated = await updateListing(req.params.id, updateData);
    res.status(200).send(updated);
  } catch (err) {
    return handleMongoDBError(res, err);
  }
};

const deleteListingCtrl = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Not found" });
    if (listing.user_id.toString() !== req.query.user_id)
      return res.status(403).json({ message: "Forbidden" });
    await deleteListing(req.params.id);
    res.status(200).send();
  } catch (err) {
    return handleMongoDBError(res, err);
  }
};

export { getListings, postListing, getUserListings, patchListing, deleteListingCtrl };
