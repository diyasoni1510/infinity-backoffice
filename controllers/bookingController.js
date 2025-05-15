const Booking = require("../models/bookingsModel");

exports.BookEvent = async (req, res) => {
  try {
    console.log(" req.body", req.body);
    const { name, email, phone, city, wedding } = req.body;

    let booking;
    // Normal signup logic
    if (!name || !email || !city || !wedding) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await Booking.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Booking already exists" });
    }

    booking = await Booking.create({ name, email, phone, city, wedding }); // You should hash password

    res.status(201).json({ message: "Booking successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
