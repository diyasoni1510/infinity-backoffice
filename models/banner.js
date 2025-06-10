const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  name: String,
  title: String,
  desc: String,
  image: String,
});

module.exports = mongoose.model("banner", bannerSchema);
