const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const SuperAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],  // Ensure name is provided
    minlength: [3, "Name must be at least 3 characters long"],  // Minimum length
    maxlength: [100, "Name can't be longer than 100 characters"],  // Maximum length
    match: [/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"], // Indian name validation (allows alphabets and spaces)
  },
  email: {
    type: String,
    unique: true,  // Email must be unique
    required: [true, "Email is required"],  // Ensure email is provided
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.in|\.co\.in)?$/,  // Indian email validation
      "Please enter a valid email address (e.g., user@example.in)"
    ],  // Validate email format with an optional .in or .co.in domain
  },
  password: {
    type: String,
    required: [true, "Password is required"],  // Ensure password is provided
    minlength: [6, "Password must be at least 6 characters long"],  // Minimum length
  },
  role: {
    type: String,
    default: "super_admin",
    required: [true, "Role is required"],  // Ensure role is provided
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],  // Ensure phone number is provided
    match: [
      /^(\+91[\-\s]?)?[7-9][0-9]{9}$/,  // Indian phone number validation (with or without country code)
      "Please enter a valid Indian phone number (e.g., +91XXXXXXXXXX or 91XXXXXXXXXX)"
    ],  // Validates Indian phone number
  },
});



module.exports = mongoose.model("superAdmin", SuperAdminSchema);
