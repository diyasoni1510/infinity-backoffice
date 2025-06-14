// models/Service.js
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String }, // Cloudinary or any storage URL
    description: { type: String },
  },
  { timestamps: true }
);

// export default mongoose.model("Service", serviceSchema);
module.exports = mongoose.model("Service", serviceSchema);
