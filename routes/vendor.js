const express = require("express");
const {
  registerVendor,
  getVendors,
  getVendorsBySubService,
  getVendorsByService,
} = require("../controllers/vendor");

const router = express.Router();

router.post("/register", registerVendor);
router.get("/", getVendors);
router.get("/service-vendors", getVendorsBySubService);
router.get("/:serviceName", getVendorsByService);

module.exports = router;
