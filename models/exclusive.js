const mongoose = require("mongoose");

const exlusiveSchema = new mongoose.Schema({
  cardImage: String,
  cardName: String,
  cardText: String,
  cardBtn: String,
  bannerImage: String,
  title: String,
  text: String,
  whatsIncluded: [String],
  reasonToChoose: [String],
  packages: [String],
  whatsapp: String,
  phone: String,
  gallery: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("exclusive", exlusiveSchema);
