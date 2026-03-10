import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true, maxlength: 60 },
    price: { type: Number, required: true, min: 0 },
    marketplace: { type: String, enum: ["eBay", "Grailed"] },
    url: { type: String, required: true },
    brand: {
      type: String,
      enum: ["Nike", "Adidas", "Levi's", "Uniqlo", "Other"],
    },
    category: {
      type: String,
      enum: [
        "Tops",
        "Bottoms",
        "Jackets",
        "Dresses",
        "Outerwear",
        "Shoes",
        "Accessories",
      ],
    },
    size: { type: String, maxlength: 10 },
    gender: { type: String, enum: ["Men", "Women", "Unisex"] },
    color: {
      type: String,
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
    description: { type: String, maxlength: 50 },
    img_url: { type: String, default: "/vite.svg" },
  },
  { collection: "listings" }
);

const Listing = mongoose.model("Listing", ListingSchema);
export { Listing };
