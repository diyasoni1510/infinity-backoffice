// routes/admin.js
const bcrypt = require("bcrypt");
const Salesperson = require("../models/salePerson");
const jwt = require("jsonwebtoken");

const RegisterSalePerson = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if a salesperson with this email already exists
    const existingSalesperson = await Salesperson.findOne({ email });
    if (existingSalesperson) {
      return res.status(409).json({ message: "Email already registered" }); // 409 Conflict
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const salesperson = new Salesperson({
      name,
      email,
      password: hashedPassword,
    });

    await salesperson.save();

    res.status(201).json({ message: "Salesperson created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginSalePerson = async (req, res) => {
  const { email, password } = req.body;

  // Exclude the 'password' field from the retrieved user object
  const user = await Salesperson.findOne({ email }).select("-password");
  if (!user) return res.status(404).json({ msg: "User not found" });

  // You'll need to fetch the user WITH the password for comparison, then fetch again or manually delete
  // A common pattern is to fetch with password, compare, then create a new object without password for the response
  const userWithPassword = await Salesperson.findOne({ email });
  const isMatch = await bcrypt.compare(password, userWithPassword.password);
  if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.json({ user }); // Now 'user' will not contain the password
};

// const RegisterSalePerson2 = async (req, res) => {
//   try {
//     const { name, email, password } = req.query;

//     if (!name || !email || !password) {
//       return res.status(400).json({ msg: "All fields are required" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const salesperson = new Salesperson({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     await salesperson.save();

//     res.status(201).json({ message: "Salesperson created" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const loginSalePerson2 = async (req, res) => {
//   try {
//     const { email, password } = req.query;

//     if (!email || !password) {
//       return res.status(400).json({ msg: "Email & Password required" });
//     }

//     const user = await Salesperson.findOne({ email });
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({ token, user });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

module.exports = {
  RegisterSalePerson,
  loginSalePerson,
};
