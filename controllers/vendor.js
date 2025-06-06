const vendor = require("../models/vendor");
const bcrypt = require("bcrypt");

const registerVendor = async (req, res) => {
  try {
    const {
      name,
      ownerName,
      email,
      phone,
      password,
      category,
      city,
      pricingStart,
      pricingEnd,
      about,
      gallery,
    } = req.body;

    // Check if already registered
    const exists = await vendor.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new vendor({
      name,
      ownerName,
      email,
      phone,
      password: hashedPassword,
      subService: category,
      city,
      pricingStart,
      pricingEnd,
      about,
      gallery,
    });

    await newVendor.save();
    res
      .status(201)
      .json({ success: true, message: "Vendor registered successfully" });
  } catch (err) {
    console.error("Vendor registration error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getVendors = async (req, res) => {
  try {
    const Vendors = await vendor.find();

    if (!Vendors) {
      return res.status(400).json({ message: "no vendors exist" });
    }

    res.status(201).json({
      message: "sub service fetched successfully.",
      vendors: Vendors,
    });
  } catch (error) {
    console.error("Error creating vendors:", error.message);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};

module.exports = { registerVendor, getVendors };
