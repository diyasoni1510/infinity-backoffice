import subService from "../models/subService.js";

// Create a new subService
export const createSubService = async (req, res) => {
  try {
    const { name, imageUrl, description, service } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }

    const existingService = await subService.findOne({ name });

    if (existingService) {
      return res.status(400).json({ message: "Item already present" });
    }

    const newService = new subService({ name, imageUrl, description, service });
    await newService.save();

    res.status(201).json({
      message: "sub service created successfully.",
      subService: newService,
    });
  } catch (error) {
    console.error("Error creating subService:", error.message);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};

export const getSubServices = async (req, res) => {
  try {
    const { service } = req.query;

    if (!service) {
      return res.status(400).json({ message: "service is required." });
    }

    const SubServices = await subService.find({ service });

    if (!SubServices) {
      return res.status(400).json({ message: "no sub services exist" });
    }

    res.status(201).json({
      message: "sub service fetched successfully.",
      subService: SubServices,
    });
  } catch (error) {
    console.error("Error creating subService:", error.message);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};
