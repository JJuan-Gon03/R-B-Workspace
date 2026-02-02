import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    user_id: { type: Number, required: true },

    title: { type: String, required: true, trim: true, maxlength: 60 },
    price: { type: Number, required: true, min: 0 },

    // the chosen marketplace from a fixed list 
    marketplace: { type: String, required: true, enum: ["eBay", "Grailed"] },

    // url is optional but we keep it required per your earlier request
    url: { type: String, required: true, trim: true },

    brand: {
      type: String,
      required: true,
      enum: ["Nike", "Adidas", "Levi's", "Uniqlo", "Other"],
    },

    category: {
      type: String,
      required: true,
      enum: ["Tops", "Bottoms", "Jackets", "Shoes", "Accessories"],
    },

    size: { type: String, required: true, trim: true, maxlength: 10 },

    gender: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Unisex"],
    },

    color: {
      type: String,
      required: true,
      enum: [
        "Black",
        "White",
        "Gray",
        "Blue",
        "Red",
        "Green",
        "Yellow",
        "Brown",
        "Purple",
      ],
    },

    description: { type: String, required: true, trim: true, maxlength: 50 },

    img_url: { type: String, default: "/vite.svg" },
  },
  { collection: "listings", timestamps: true }
);

const Listing = mongoose.model("Listing", ListingSchema);

// Make sure mongoose connection is good
mongoose.set("debug", true);
mongoose
  .connect("mongodb://localhost:27017/randb", {})
  .catch((error) => console.log("error connecting to mongodb:\n", error));

// DB helper functions
function getListings() {
  return Listing.find({}).sort({ createdAt: -1 });
}

function addListing(listing) {
  return Listing.create(listing);
}

export default { getListings, addListing };
