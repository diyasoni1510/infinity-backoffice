import service from "../models/service.js";

// Create a new service
export const createService = async (req, res) => {
  try {
    const { name, imageUrl, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }

    const existingService = await service.findOne({ name });

    if (existingService) {
      return res.status(400).json({ message: "Item already present" });
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

export const getServices = async (req, res) => {
  try {
    const Services = await service.find();

    if (!Services) {
      return res.status(400).json({ message: "no services exist" });
    }

    res.status(201).json({
      message: "sub service fetched successfully.",
      service: Services,
    });
  } catch (error) {
    console.error("Error creating subService:", error.message);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};

// module.exports = { createService };
