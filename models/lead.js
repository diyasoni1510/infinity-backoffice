const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: { type: String, required: true },
    city: String,
    wedding: Date,
    message: String,
    getNotify: Boolean,
    event: String,
    followUp: Date,
    offer: { type: String, default: "none" },
    status: { type: String, default: "pending" },
    noOfRep: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("lead", leadSchema);
