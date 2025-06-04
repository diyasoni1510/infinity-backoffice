// models/Service.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String }, // Cloudinary or any storage URL
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
