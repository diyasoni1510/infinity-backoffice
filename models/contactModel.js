const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    city: String,
    wedding: Date,
    message: String,
    getNotify: Boolean,
    event: String,
    followUp: Date,
    offer: { type: String, default: "none" },
    status: { type: String, default: "pending" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);
