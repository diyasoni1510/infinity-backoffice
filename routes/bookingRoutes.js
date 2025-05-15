const express = require("express");
const { BookEvent } = require("../controllers/bookingController");

const router = express.Router();

router.post("/booking-event", BookEvent);

module.exports = router;
