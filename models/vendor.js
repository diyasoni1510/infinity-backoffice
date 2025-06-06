const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: true },
  pricingStart: Number,
  pricingEnd: Number,
  about: String,
  profileImage: String,
  gallery: [String],
  subService: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubService",
    required: true,
  },
  rating: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("vendors", vendorSchema);
