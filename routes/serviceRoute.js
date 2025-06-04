const express = require("express");
const { createService } = require("../controllers/serviceController");

const router = express.Router();

router.post("/create", createService);

module.exports = router;
