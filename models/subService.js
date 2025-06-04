// models/SubService.js
import mongoose from "mongoose";

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

export default mongoose.model("SubService", subServiceSchema);
