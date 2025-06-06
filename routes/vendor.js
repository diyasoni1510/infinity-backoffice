const express = require("express");
const { registerVendor, getVendors } = require("../controllers/vendor");

const router = express.Router();

router.post("/register", registerVendor);
router.get("/", getVendors);

module.exports = router;
