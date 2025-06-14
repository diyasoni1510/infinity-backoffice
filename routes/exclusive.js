const express = require("express");
const { getExclusive, getExclusiveById } = require("../controllers/exclusive");

const router = express.Router();

router.get("/", getExclusive);
router.get("/:id", getExclusiveById);
module.exports = router;
