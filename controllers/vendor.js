const vendor = require("../models/vendor");
const bcrypt = require("bcrypt");
// const { ObjectId } = require("mongoose").Types;
const mongoose = require("mongoose");
// const ObjectId = mongoose.Types.ObjectId;
const subService = require("../models/subService");
const service = require("../models/service");

const registerVendor = async (req, res) => {
  try {
    const {
      name,
      ownerName,
      email,
      phone,
      password,
      category,
      city,
      pricingStart,
      pricingEnd,
      about,
      gallery,
    } = req.body;

    // Check if already registered
    const exists = await vendor.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new vendor({
      name,
      ownerName,
      email,
      phone,
      password: hashedPassword,
      subService: category,
      city,
      pricingStart,
      pricingEnd,
      about,
      gallery,
    });

    await newVendor.save();
    res
      .status(201)
      .json({ success: true, message: "Vendor registered successfully" });
  } catch (err) {
    console.error("Vendor registration error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getVendors = async (req, res) => {
  try {
    const Vendors = await vendor.find();

    if (!Vendors) {
      return res.status(400).json({ message: "no vendors exist" });
    }

    res.status(201).json({
      message: "sub service fetched successfully.",
      vendors: Vendors,
    });
  } catch (error) {
    console.error("Error creating vendors:", error.message);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};

// const getVendorsBySubService = async (req, res) => {
//   try {
//     const { type } = req.query;
//     console.log("Requested Type:", type);

//     // Step 1: Find subService by name
//     const existingSubService = await subService.findOne({ name: type });

//     if (!existingSubService) {
//       return res
//         .status(404)
//         .json({ message: "No subservice found with this name." });
//     }

//     const subServiceId = existingSubService._id;
//     console.log("SubService Found:", subServiceId.toString());

//     const oneVendor = await vendor.findOne({});

//     console.log("oneVendor", oneVendor);
//     console.log("subServiceId.toString()", subServiceId);

//     const vendors = await vendor.findOne({
//       subService: subServiceId,
//     });

//     console.log("vendors", vendors);

//     if (!vendors || vendors.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No vendors found for this type." });
//     }

//     // Step 3: Return vendors
//     res.status(200).json({
//       message: "Vendors fetched successfully.",
//       vendors,
//     });
//   } catch (error) {
//     console.error("Error fetching vendors:", error.message);
//     res.status(500).json({ message: "Server error. Try again later." });
//   }
// };

const getVendorsBySubService = async (req, res) => {
  try {
    const { type } = req.query;
    console.log("SubService type from query:", type);

    const existingSubService = await subService.findOne({
      name: { $regex: `^${type}$`, $options: "i" }, // in case of case mismatch
    });

    if (!existingSubService) {
      return res.status(404).json({ message: "SubService not found." });
    }

    const serviceId = existingSubService._id;
    console.log("Matched SubService ID:", serviceId);

    const vendors = await vendor.find({
      subService: serviceId,
    });

    console.log("vendors", vendors);

    if (!vendors) {
      return res
        .status(404)
        .json({ message: "No vendors found for this sub-service." });
    }

    return res.status(200).json({
      message: "Vendors fetched successfully",
      vendors,
    });
  } catch (error) {
    console.log("Error in getVendorsBySubService:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// const getVendorsByService = async (req, res) => {
//   try {
//     const { serviceName } = req.params;
//     const { type, city } = req.query;

//     console.log("serviceName", serviceName);

//     // Step 1: Find the service by name
//     const existingService = await service.findOne({ name: serviceName });
//     if (!existingService) {
//       return res.status(404).json({ message: "Service not found" });
//     }

//     let subServiceIds = [];

//     // Step 2: If type is given, find subservice with that name under the same service
//     if (type) {
//       const matchedSub = await subService.findOne({
//         name: type,
//         service: existingService._id,
//       });

//       if (!matchedSub) {
//         return res
//           .status(404)
//           .json({ message: "SubService not found for this service" });
//       }

//       subServiceIds.push(matchedSub._id);
//     } else {
//       // If no type given, fetch all subservices under the service
//       const allSub = await subService.find({ service: existingService._id });
//       subServiceIds = allSub.map((sub) => sub._id);
//     }

//     // Step 3: Vendor query build
//     const vendorQuery = {
//       subService: { $in: subServiceIds },
//     };

//     if (city) {
//       vendorQuery.city = city;
//     }

//     const vendors = await vendor.find(vendorQuery).populate("subService");

//     return res.status(200).json({
//       message: "Vendors fetched successfully",
//       data: vendors,
//     });
//   } catch (error) {
//     console.error("Error fetching vendors:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

module.exports = {
  registerVendor,
  getVendors,
  getVendorsBySubService,
  // getVendorsByService,
};
