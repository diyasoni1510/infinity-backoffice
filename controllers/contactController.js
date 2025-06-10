const Contact = require("../models/contactModel");

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

// const getContactWithStatus = async (req, res) => {
//   const { status } = req.params;

//   try {
//     const contacts = await Contact.find({ status });

//     if (contacts.length === 0) {
//       return res
//         .status(404)
//         .json({ message: `No contacts found with status: ${status}` });
//     }

//     res.status(200).json({ success: true, data: contacts });
//   } catch (error) {
//     console.error("Error fetching contacts by status:", error.message);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

const getContactWithStatus = async (req, res) => {
  const { status } = req.params;
  const { date, page = 1, limit = 10 } = req.query;

  try {
    const query = { status };

    // Date filter logic
    if (date === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    } else if (date) {
      const specificDate = new Date(date);
      if (isNaN(specificDate)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid date format" });
      }
      const start = new Date(specificDate.setHours(0, 0, 0, 0));
      const end = new Date(specificDate.setHours(23, 59, 59, 999));
      query.createdAt = { $gte: start, $lte: end };
    }

    // Pagination calculation
    const skip = (page - 1) * limit;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    if (contacts.length === 0) {
      return res
        .status(404)
        .json({ message: `No contacts found with status: ${status}` });
    }

    res.status(200).json({
      success: true,
      data: contacts,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
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

    return res.status(200).json({
      status: "success",
      message: "Thank you for contacting us! We’ll reach out to you soon.",
    });
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

const addRemarkToContact = async (req, res) => {
  try {
    const { contactId } = req.params; // assuming contact ID comes from route
    const { message, addedBy } = req.body;

    if (!message || !addedBy) {
      return res
        .status(400)
        .json({ error: "Message and addedBy are required." });
    }

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found." });
    }

    // Push new remark
    contact.remarks.push({ message, addedBy });

    await contact.save();

    res.status(200).json({ message: "Remark added successfully.", contact });
  } catch (error) {
    console.error("Error adding remark:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getRemark = async (req, res) => {
  try {
    const { contactId } = req.params; // assuming contact ID comes from route

    if (!contactId) {
      return res.status(400).json({ error: "contactId are required." });
    }

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found." });
    }

    const remarks = contact.remarks;

    res.status(200).json({ message: "Remark fetched successfully.", remarks });
  } catch (error) {
    console.error("Error adding remark:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  submitContactForm,
  getContacts,
  updateContactStatus,
  updateFollowUpDate,
  getContactWithStatus,
  addRemarkToContact,
  getRemark,
};
