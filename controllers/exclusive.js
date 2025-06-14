const exclusive = require("../models/exclusive");

const getExclusive = async (req, res) => {
  try {
    const exclusives = await exclusive.find({});

    if (exclusives.length === 0) {
      return res
        .status(400)
        .json({ message: "we dont have any exclusive services" });
    }

    return res.status(201).json({
      message: "exclusive fetched successfully",
      exclusives: exclusives,
    });
  } catch (error) {
    console.error("Error saving lead:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getExclusiveById = async (req, res) => {
  try {
    const { id } = req.params;
    const exclusiveWithId = await exclusive.findOne({ _id: id });

    if (exclusiveWithId.length === 0) {
      return res.status(400).json({
        message: "we dont have any exclusive services with the given id",
      });
    }

    return res.status(201).json({
      message: "exclusive fetched successfully with the id",
      exclusive: exclusiveWithId,
    });
  } catch (error) {
    console.error("Error saving lead:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getExclusive, getExclusiveById };
