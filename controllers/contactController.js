const Contact = require("../models/contactModel");
const Booking = require("../models/bookingsModel");

const submitContactForm = async (req, res) => {
  const {
    name,
    email,
    phone,
    country,
    city,
    wedding,
    event,
    message,
    getNotify,
  } = req.body;

  try {
    // Step 1: Check if the same city + date already has a booking
    const existingBooking = await Booking.findOne({
      city: city,
      // wedding: new Date(wedding),
    });

    console.log("existingBooking", existingBooking);

    // Step 2: Save the new booking regardless
    const newBooking = new Contact({
      name,
      email,
      phone,
      country,
      city,
      wedding,
      event,
      message,
      getNotify,
    });

    await newBooking.save();

    // Step 3: Return different response based on availability
    if (existingBooking) {
      return res.status(200).json({
        status: "warning",
        message:
          "We’ve received your request, but the selected date in this city might be unavailable.",
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: "Thank you for contacting us! We’ll reach out to you soon.",
      });
    }
  } catch (err) {
    console.error("Error saving contact:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();

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

module.exports = { submitContactForm, getContacts };
