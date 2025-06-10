const Banner = require("../models/banner"); // adjust path as needed

const getBanner = async (req, res) => {
  try {
    const banner = await Banner.find();

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json(banner);
  } catch (error) {
    console.error("Error fetching banner:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getBanner };
