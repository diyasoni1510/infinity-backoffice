const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true },
    emailVerified: { type: Boolean, required: true, default: false },
    password: String,
    phone: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", UserSchema);
