const express = require("express");
const {
  submitContactForm,
  getContacts,
  updateContactStatus,
  updateFollowUpDate,
  getContactWithStatus,
  addRemarkToContact,
  getRemark,
} = require("../controllers/contactController");

const router = express.Router();

router.post("/submit", submitContactForm);
router.get("/contacts", getContacts);
router.patch("/contacts/:contactId/status", updateContactStatus);
router.patch("/contacts/:contactId/followup", updateFollowUpDate);
router.get("/contacts/:status", getContactWithStatus);
router.post("/contacts/:contactId/remark", addRemarkToContact);
router.get("/contacts/:contactId/remark", getRemark);

module.exports = router;
