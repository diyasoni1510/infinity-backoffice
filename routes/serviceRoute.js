const express = require("express");
const {
  createService,
  getServices,
} = require("../controllers/serviceController");

const router = express.Router();

router.post("/create", createService);
router.get("/", getServices);

module.exports = router;
