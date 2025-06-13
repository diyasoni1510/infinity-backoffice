const mongoose = require("mongoose");

const exlusiveSchema = new mongoose.Schema({
  bannerImage: String,
  whatsIncluded: [String],
  reasonToChoose: [String],
  packages: [String],
  whatsapp: String,
  phone: String,
  gallery: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("exclusive", exlusiveSchema);
