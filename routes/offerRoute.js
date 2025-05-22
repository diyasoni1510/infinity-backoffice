const express = require("express");
const { getOffers } = require("../controllers/offerController");

const router = express.Router();

router.get("/offers", getOffers);

module.exports = router;
