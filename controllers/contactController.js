const Contact = require("../models/contactModel");
const Booking = require("../models/bookingsModel");

const moment = require("moment"); // npm install moment

const getContacts = async (req, res) => {
  try {
    // Parse query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const createdAt = req.query.createdAt?.toLowerCase(); // e.g., 'today' or '2025-05-27'

    let filter = {};

    // 🔍 Filter by date (exact or today)
    if (createdAt) {
      let startDate, endDate;

      if (createdAt === "today") {
        startDate = moment().startOf("day").toDate();
        endDate = moment().endOf("day").toDate();
      } else if (moment(createdAt, "YYYY-MM-DD", true).isValid()) {
        startDate = moment(createdAt).startOf("day").toDate();
        endDate = moment(createdAt).endOf("day").toDate();
      } else {
        return res.status(400).json({
          message: "Invalid date format. Use 'YYYY-MM-DD' or 'today'.",
        });
      }

      filter.createdAt = { $gte: startDate, $lte: endDate };
    }

    // Fetch contacts with filters
    const contacts = await Contact.find(filter)
      .select("name email phone city status createdAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // latest first
      .lean();

    // Count total for frontend pagination
    const total = await Contact.countDocuments(filter);

    if (!contacts.length) {
      return res.status(404).json({ message: "No contacts found." });
    }

    return res.status(200).json({
      message: "Contacts retrieved successfully.",
      data: contacts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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

const VALID_TRANSITIONS = {
  pending: ["ongoing"],
  ongoing: ["rejected", "completed"],
  rejected: ["ongoing"],
  completed: ["ongoing"],
};

const updateContactStatus = async (req, res) => {
  const { contactId } = req.params;
  const { newStatus } = req.body;

  if (!newStatus) {
    return res.status(400).json({ message: "New status is required." });
  }

  try {
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found." });
    }

    const currentStatus = contact.status || "pending";

    if (!VALID_TRANSITIONS[currentStatus]?.includes(newStatus)) {
      return res.status(400).json({
        message: `Invalid status transition from '${currentStatus}' to '${newStatus}'.`,
      });
    }

    contact.status = newStatus;
    await contact.save();

    return res.status(200).json({
      message: `Status updated from '${currentStatus}' to '${newStatus}'`,
      data: contact,
    });
  } catch (error) {
    console.error("Error updating contact status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// const getContactWithStatus = async (req, res) => {
//   const { status } = req.params;
// };

const getContactWithStatus = async (req, res) => {
  const { status } = req.params;

  try {
    const contacts = await Contact.find({ status });

    if (contacts.length === 0) {
      return res
        .status(404)
        .json({ message: `No contacts found with status: ${status}` });
    }

    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error fetching contacts by status:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const submitContactForm = async (req, res) => {
  const {
    name,
    email,
    phone,
    city,
    wedding,
    event,
    message,
    getNotify,
    offer,
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
      city,
      wedding,
      event,
      message,
      getNotify,
      offer,
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

// const getContacts = async (req, res) => {
//   try {
//     // const contacts = await Contact.find();
//     const contacts = await Contact.find()
//       .sort({ createdAt: 1 }) // Optional: newest first
//       .lean(); // Skip hydration, return plain JS objects

//     if (!contacts || contacts.length === 0) {
//       return res.status(404).json({ message: "No contacts found." });
//     }

//     return res.status(200).json({
//       message: "Contacts retrieved successfully.",
//       data: contacts,
//     });
//   } catch (error) {
//     console.error("Error retrieving contacts:", {
//       message: error.message,
//       stack: error.stack,
//     });

//     return res.status(500).json({
//       message: "An unexpected error occurred while retrieving contacts.",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

const updateFollowUpDate = async (req, res) => {
  const { contactId } = req.params;
  const { followUp } = req.body;

  if (!followUp) {
    return res.status(400).json({ message: "followUp date is required." });
  }

  // Validate date
  if (!moment(followUp, moment.ISO_8601, true).isValid()) {
    return res.status(400).json({
      message:
        "Invalid date format. Use ISO format (YYYY-MM-DD or full datetime).",
    });
  }

  try {
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found." });
    }

    contact.followUp = new Date(followUp);
    await contact.save();

    return res.status(200).json({
      message: "Follow-up date updated successfully.",
      data: {
        _id: contact._id,
        followUp: contact.followUp,
      },
    });
  } catch (error) {
    console.error("Error updating follow-up date:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  submitContactForm,
  getContacts,
  updateContactStatus,
  updateFollowUpDate,
  getContactWithStatus,
};
