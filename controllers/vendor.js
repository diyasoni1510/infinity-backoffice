const vendor = require("../models/vendor");
const bcrypt = require("bcrypt");

// POST /api/vendors/register
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
      category,
      city,
      pricingStart,
      pricingEnd,
      about,
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

module.exports = { registerVendor };
