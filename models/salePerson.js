// models/Salesperson.js
const mongoose = require("mongoose");

const salespersonSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Hashed
  phone: String,
  profilePic: String,
  dateJoined: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: null },
  region: String,
  clientStats: {
    total: Number,
    ongoing: Number,
    rejected: Number,
    completed: Number,
  },
  conversionRate: Number,
  avgResponseTimeInMins: Number,
  rating: Number,
  targets: {
    monthlyTarget: Number,
    achieved: Number,
  },
  verified: { type: Boolean, default: false },
  commissionEarned: Number,
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }],
  //   role: {
  //     type: String,
  //     enum: ["admin", "salesperson"],
  //     default: "salesperson",
  //   },
});

module.exports = mongoose.model("Salesperson", salespersonSchema);
