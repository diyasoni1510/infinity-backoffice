const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// exports.login = async (req, res) => {
//   try {
//     const { email, password, credential } = req.body;

//     // ---------- Google Login ----------
//     if (credential) {
//       const ticket = await client.verifyIdToken({
//         idToken: credential,
//         audience: process.env.GOOGLE_CLIENT_ID,
//       });

//       const payload = ticket.getPayload(); // Contains user info

//       const { email, name, picture, sub } = payload;

//       // Find existing user or create new one
//       let user = await User.findOne({ email });

//       if (!user) {
//         user = await User.create({
//           name,
//           email,
//           emailVerified: true,
//           googleId: sub,
//           image: picture,
//         });
//       }

//       // Generate JWT
//       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//         expiresIn: "7d",
//       });

//       return res.status(200).json({ token, user });
//     }

//     // ---------- Traditional Login ----------
//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email and password are required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user || !user.password) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     return res.status(200).json({ token, user });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password, phone } = req.body;

//     if (!name || !email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Name, email and password are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(409)
//         .json({ message: "User with this email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       emailVerified: false,
//     });

//     const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     return res.status(201).json({ token, user: newUser });
//   } catch (err) {
//     console.error("Signup error:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
exports.login = async (req, res) => {
  const { email, password, credential } = req.body;

  try {
    // 🔐 Google Login
    if (credential) {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email, name } = payload;

      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({ name, email, emailVerified: true });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res
        .status(200)
        .json({ message: "Google login successful", token, user });
    }

    // 🧾 Email/Password Login
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password) {
      return res
        .status(400)
        .json({ message: "Please use Google login for this account" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.signup = async (req, res) => {
  try {
    const { name, email, password, credential } = req.body;

    let user;

    // If Google credential exists (from GoogleLogin)
    if (credential) {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email, name } = payload;

      user = await User.findOne({ email });

      if (!user) {
        user = await User.create({ name, email, emailVerified: true });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res
        .status(200)
        .json({ message: "Google Login Success", token, user });
    }

    // Normal signup logic
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = await User.create({ name, email, password }); // You should hash password

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ message: "Signup successful", token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
