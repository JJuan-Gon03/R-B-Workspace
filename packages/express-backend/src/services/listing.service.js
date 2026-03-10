import { Listing } from "../models/listing.model.js";

function getListings() {
  return Listing.find().sort({ _id: -1 });
}

function addListing(listing) {
  return Listing.create(listing);
}

function getListingsByUser(user_id) {
  return Listing.find({ user_id }).sort({ _id: -1 });
}

function updateListing(id, data) {
  return Listing.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function deleteListing(id) {
  return Listing.findByIdAndDelete(id);
}

export { getListings, addListing, getListingsByUser, updateListing, deleteListing };
