const lead = require("../models/lead");

const saveLead = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const leadExists = await lead.findOne({ phone });

    if (leadExists) {
      return res.status(400).json({ message: "Lead is already there" });
    }

    const newLead = new lead({ phone });
    await newLead.save();

    return res
      .status(201)
      .json({ message: "Lead saved successfully", lead: newLead });
  } catch (error) {
    console.error("Error saving lead:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { saveLead };
