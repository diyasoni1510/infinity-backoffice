const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConnect");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const offerRoutes = require("./routes/offerRoute");
const salePersonRoutes = require("./routes/salePerson");
const vendorRoutes = require("./routes/vendor");
const serviceRoute = require("./routes/serviceRoute");
const subServiceRoute = require("./routes/subService");
const leadRoute = require("./routes/leadRoutes");
const bannerRoute = require("./routes/bannerRoute");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", contactRoutes);
app.use("/api", authRoutes);
app.use("/api", offerRoutes);
app.use("/api/sales", salePersonRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/service", serviceRoute);
app.use("/api/sub-service", subServiceRoute);
app.use("/api/lead", leadRoute);
app.use("/api/banner", bannerRoute);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
