const express = require("express");
const { registerVendor } = require("../controllers/vendor");

const router = express.Router();

router.post("/register", registerVendor);

module.exports = router;
