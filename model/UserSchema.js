const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

bcrypt.setRandomFallback((len) => crypto.randomBytes(len));

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [100, "Name can't be longer than 100 characters"],
    match: [/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.in|\.co\.in)?$/,
      "Please enter a valid email address (e.g., user@example.in)"
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  role: {
    type: String,
    enum: {
      values: ["patient", "doctor", "hospital_manager", "super_admin"],
      message: "{VALUE} is not a valid role",
    },
    default: "patient",
    required: [true, "Role is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [
      /^(\+91[\-\s]?)?[7-9][0-9]{9}$/,
      "Please enter a valid Indian phone number (e.g., +91XXXXXXXXXX)"
    ],
  },
  location: {
    type: String,
    required: function () {
      return this.role === "patient";
    },
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: function () {
      return this.role === "doctor" || this.role === "hospital_manager";
    },
  },
  status: {
    type: String,
    enum: {
      values: ["Pending", "Active"],
      message: "{VALUE} is not a valid status",
    },
    default: "Pending",
  },
  verificationToken: {
    type: String,
    required: false,
  },

  // ✅ Newly added fields
  address: {
    type: String,
    default: "no address",
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Male",
  },
  age: {
    type: Number,
    min: 0,
    default: 20,
  },
  imageUrl: {
    type: String,
    default: "/images/user.png"
  }
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
  } catch (err) {
    console.log(err);
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
