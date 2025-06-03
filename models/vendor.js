const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  category: { type: String, required: true }, // e.g., "Photographer"
  city: { type: String, required: true },
  pricingStart: Number,
  pricingEnd: Number,
  about: String,
  profileImage: String,
  gallery: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("vendors", vendorSchema);
