const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConnect");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookingRoutes");
const offerRoutes = require("./routes/offerRoute");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", contactRoutes);
app.use("/api", authRoutes);
app.use("/api", bookRoutes);
app.use("/api", offerRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
