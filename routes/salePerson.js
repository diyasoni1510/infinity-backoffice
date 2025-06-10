const express = require("express");
const {
  RegisterSalePerson,
  loginSalePerson,
} = require("../controllers/salePerson");

const router = express.Router();

router.post("/register", RegisterSalePerson);
router.post("/login", loginSalePerson);
// router.get("/register", RegisterSalePerson2);
// router.get("/login", loginSalePerson2);

module.exports = router;
