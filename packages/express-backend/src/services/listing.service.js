import { Listing } from "../models/listing.model.js";

function getListings() {
  return Listing.find().sort({ _id: -1 });
}

function addListing(listing) {
  return Listing.create(listing);
}

export { getListings, addListing };
