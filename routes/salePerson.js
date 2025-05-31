const express = require("express");
const {
  RegisterSalePerson,
  loginSalePerson,
} = require("../controllers/salePerson");

const router = express.Router();

router.post("/register", RegisterSalePerson);
router.post("/login", loginSalePerson);

module.exports = router;
