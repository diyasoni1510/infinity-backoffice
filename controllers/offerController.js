const { default: Offer } = require("../models/offerModal");

const getOffers = async (req, res) => {
  try {
    const contacts = await Offer.find();

    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ message: "No contacts found." });
    }

    return res.status(200).json({
      message: "Contacts retrieved successfully.",
      data: contacts,
    });
  } catch (error) {
    console.error("Error retrieving contacts:", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      message: "An unexpected error occurred while retrieving contacts.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = { getOffers };
