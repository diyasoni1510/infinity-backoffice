// models/Offer.js
import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    discountPercent: {
      type: Number,
      required: true,
    },
    validTill: {
      type: Date,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    destination: {
      type: String,
      enum: [
        "goa",
        "jaipur",
        "jodhpur",
        "neemrana",
        "jim-corbett",
        "udaipur",
        "kasol",
        "mussorie",
        "indore",
        "pune",
        "shimla",
        "mt-abu",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const Offer = mongoose.models.Offer || mongoose.model("Offer", offerSchema);
export default Offer;
