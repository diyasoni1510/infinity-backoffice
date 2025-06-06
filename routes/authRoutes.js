const express = require("express");
const { login, signup } = require("../controllers/authController");

const router = express.Router();
const axios = require("axios");

router.post("/login", login);
router.post("/signup", signup);

const otpMap = new Map();

// for random 6 digit
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// router.post("/send-otp", async (req, res) => {
//   const { phone } = req.body;

//   if (!phone) return res.status(400).json({ msg: "Phone required" });

//   const otp = generateOtp();
//   const expires = Date.now() + 5 * 60 * 1000; // 5 mins expiry

//   otpMap.set(phone, { otp, expires });

//   // 👇 Replace this with actual SMS API like Twilio or Fast2SMS
//   console.log(`Sending OTP ${otp} to ${phone}`);

//   res.json({ msg: "OTP sent" });
// });

router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  const expires = Date.now() + 5 * 60 * 1000;
  otpMap.set(phone, { otp, expires });

  try {
    const apiKey = process.env.TWOFACTOR_API_KEY;
    const response = await axios.get(
      `https://2factor.in/API/V1/${apiKey}/SMS/+91${phone}/${otp}/OTP1`
    );

    if (response.data.Status === "Success") {
      res.json({ msg: "OTP sent" });
    } else {
      res
        .status(400)
        .json({ msg: "Failed to send OTP", reason: response.data.Details });
    }
  } catch (err) {
    console.error("OTP Send Failed:", err);
    res.status(500).json({ msg: "Server Error in OTP send" });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  const data = otpMap.get(phone);
  if (!data) return res.status(400).json({ msg: "OTP not sent" });

  if (Date.now() > data.expires) {
    otpMap.delete(phone);
    return res.status(400).json({ msg: "OTP expired" });
  }

  if (data.otp !== otp) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  // ✅ OTP verified, delete it from memory
  otpMap.delete(phone);

  // 👉 Now save the phone in DB
  // await User.create({ phone }) or update existing user etc.

  return res.json({ success: true, msg: "OTP verified" });
});
module.exports = router;
