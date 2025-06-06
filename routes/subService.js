const express = require("express");
const {
  createSubService,
  getSubServices,
} = require("../controllers/subService");

const router = express.Router();

router.post("/create", createSubService);
router.get("/", getSubServices);

module.exports = router;
