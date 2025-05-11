




const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
  Place_name: {
    type: String,
    required: [true, "Hospital name is required"],
    minlength: [3, "Hospital name must be at least 3 characters long"],
    // maxlength: [100, "Hospital name can't be longer than 100 characters"],
    // match: [/^[a-zA-Z0-9\s&()\-]+$/,
  },
  Address1: {
    type: String,
    required: [true, "Address is required"],
    minlength: [10, "Address must be at least 10 characters long"],
    // match: [/^[a-zA-Z0-9\s,.\-+/]+$/, "Address can only contain letters, numbers, commas, dots, hyphens, plus (+), and forward slashes (/)"],
  },   
  District: {
    type: String,
    required: [true, "District is required"],
    match: [/^[a-zA-Z\s.\-]+$/, "District can only contain letters, spaces, dots (.), and hyphens (-)"],
  },  
  State: {
    type: String,
    required: [true, "State is required"],
    match: [/^[a-zA-Z\s]+$/, "State can only contain letters and spaces"],
  },
  Pincode: {
    type: String,
    required: [true, "Pincode is required"],
    match: [/^\d{6}$/, "Please enter a valid 6-digit pincode"],
  },
  Phone: {
    type: String,
    default: "9999991111",
    // match: [/^(\+91[\-\s]?)?0?[7-9][0-9]{9}$/, "Please enter a valid Indian phone number"],
  },
  Email: {
    type: String,
    sparse: true,
    default:"abcd@gmail.com",
    // match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.in|\.co\.in)?$/, "Please enter a valid email address"],
  },
  Hours: {
    type: String,
    default: "",
  },
  Location: {
    type: String,
    required: [true, "Location URL is required"],
  },
  Total_score: {
    type: Number,
    default: 0,
    min: [0, "Score cannot be negative"],
    max: [5, "Score cannot be more than 5"],
  },
  Featured_Image: {
    type: String,
    default: "",
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isPending: {
    type: Boolean,
    default: true,
  },
  Speciality: {
    type: [String],  // Array of specialities (optional)
    validate: {
      validator: function (v) {
        return v.every(spec => ["nose", "lungs", "brain", "kidney", "liver", "eye", "heart", "ear"].includes(spec));
      },
      message: "Invalid speciality provided",
    },
    default:"other", // Ensures it's optional
  },
  specializations: {
    type: [String],
    default: []
  },
  hospitalManagers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
});

module.exports = mongoose.model("Hospital", HospitalSchema);
