const express = require("express");
const {
  registerVendor,
  getVendors,
  getVendorsBySubService,
} = require("../controllers/vendor");

const router = express.Router();

router.post("/register", registerVendor);
router.get("/", getVendors);
router.get("/service-vendors", getVendorsBySubService);

module.exports = router;
