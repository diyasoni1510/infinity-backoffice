const express = require("express");
const { saveLead } = require("../controllers/leadController");

const router = express.Router();

router.post("/save", saveLead);

module.exports = router;
