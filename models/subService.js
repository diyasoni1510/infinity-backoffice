const mongoose = require("mongoose");

const subServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    imageUrl: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubService", subServiceSchema);
