const express = require("express");
const {
  submitContactForm,
  getContacts,
  updateContactStatus,
  updateFollowUpDate,
  getContactWithStatus,
} = require("../controllers/contactController");

const router = express.Router();

router.post("/submit", submitContactForm);
router.get("/contacts", getContacts);
router.patch("/contacts/:contactId/status", updateContactStatus);
router.patch("/contacts/:contactId/followup", updateFollowUpDate);
router.get("/contacts/:status", getContactWithStatus);

module.exports = router;
