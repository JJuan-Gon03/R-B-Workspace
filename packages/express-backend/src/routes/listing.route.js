import express from "express";
import {
  getListings,
  postListing,
  getUserListings,
  patchListing,
  deleteListingCtrl,
} from "../controllers/listing.controller.js";

const router = express.Router();

router.get("/user/:user_id", getUserListings);
router.get("/", getListings);
router.post("/", postListing);
router.patch("/:id", patchListing);
router.delete("/:id", deleteListingCtrl);

export default router;
