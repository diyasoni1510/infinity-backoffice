import service from "../models/service.js";

// Create a new service
export const createService = async (req, res) => {
  try {
    const { name, imageUrl, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }

    const newService = new service({ name, imageUrl, description });
    await newService.save();

    res.status(201).json({
      message: "Service created successfully.",
      service: newService,
    });
  } catch (error) {
    console.error("Error creating service:", error.message);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};

// module.exports = { createService };
