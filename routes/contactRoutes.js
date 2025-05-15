const express = require("express");
const {
  submitContactForm,
  getContacts,
} = require("../controllers/contactController");

const router = express.Router();

router.post("/submit", submitContactForm);
router.get("/contacts", getContacts);

module.exports = router;
