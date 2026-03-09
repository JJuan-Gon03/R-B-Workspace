import {
  getListings as getListingsService,
  addListing,
} from "../services/listing.service.js";
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

export { getListings, postListing };
