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

// router.post("/send-otp", async (req, res) => {
//   const { phone } = req.body;
//   const otp = Math.floor(100000 + Math.random() * 900000);

//   const expires = Date.now() + 5 * 60 * 1000;
//   otpMap.set(phone, { otp, expires });

//   try {
//     const apiKey = process.env.TWOFACTOR_API_KEY;
//     const response = await axios.get(
//       `https://2factor.in/API/V1/${apiKey}/SMS/+91${phone}/${otp}/OTP1`
//     );

//     if (response.data.Status === "Success") {
//       res.json({ msg: "OTP sent" });
//     } else {
//       res
//         .status(400)
//         .json({ msg: "Failed to send OTP", reason: response.data.Details });
//     }
//   } catch (err) {
//     console.error("OTP Send Failed:", err);
//     res.status(500).json({ msg: "Server Error in OTP send" });
//   }
// });

// const otpMap = new Map(); // You can move this to a better place depending on your architecture

// router.post("/send-otp", async (req, res) => {
//   const { phone } = req.body;

//   // Basic validation
//   if (!phone || !/^\d{10}$/.test(phone)) {
//     return res.status(400).json({ msg: "Invalid phone number" });
//   }

//   const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
//   const expires = Date.now() + 5 * 60 * 1000; // expires in 5 mins
//   otpMap.set(phone, { otp, expires });

//   try {
//     const apiKey = process.env.TWOFACTOR_API_KEY;
//     if (!apiKey) {
//       return res.status(500).json({ msg: "API Key missing" });
//     }

//     const message = `Your OTP is ${otp}`; // Optional: Custom message for some providers
//     const url = `https://2factor.in/API/V1/${apiKey}/SMS/+91${phone}/${otp}/BookMySquad`;

//     const response = await axios.get(url);

//     console.log("response", response);

//     if (response.data.Status === "Success") {
//       return res.json({ msg: "OTP sent successfully" });
//     } else {
//       return res.status(400).json({
//         msg: "Failed to send OTP",
//         reason: response.data.Details || "Unknown error from SMS provider",
//       });
//     }
//   } catch (err) {
//     console.error("OTP Send Failed:", err.message);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// });

router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ msg: "Invalid phone number" });
  }
  try {
    const apiKey = process.env.TWOFACTOR_API_KEY;
    const resp = await axios.get(
      `https://2factor.in/API/V1/${apiKey}/SMS/+91${phone}/AUTOGEN`
    );
    if (resp.data.Status === "Success") {
      const sessionId = resp.data.Details;
      // Save sessionId if needed to verify later
      otpMap.set(phone, { sessionId, expires: Date.now() + 5 * 60 * 1000 });
      return res.json({ msg: "OTP sent", sessionId });
    }
    return res
      .status(400)
      .json({ msg: "Send failed", reason: resp.data.Details });
  } catch (err) {
    console.error("Send OTP err:", err.response?.data || err.message);
    return res.status(500).json({ msg: "Server error" });
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
