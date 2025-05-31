// routes/admin.js
const bcrypt = require("bcrypt");
const Salesperson = require("../models/salePerson");
const jwt = require("jsonwebtoken");

const RegisterSalePerson = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const salesperson = new Salesperson({
      name,
      email,
      password: hashedPassword,
    });

    await salesperson.save();

    res.status(201).json({ message: "Salesperson created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginSalePerson = async (req, res) => {
  const { email, password } = req.body;

  const user = await Salesperson.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.json({ token, user });
};

module.exports = { RegisterSalePerson, loginSalePerson };
