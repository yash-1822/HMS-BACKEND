const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  qualification: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", default: null },
  Hours: { type: String, default: "" },
  doctor_image: { type: String, required: true },
  ratings: { type: Number, default: 2 },
  about: { type: String, required: true },
  experience: { type: Number, required: true },
  consultancyFees: { type: Number, required: true },
  noOfOps: { type: Number, default: 0 },
  bodyPart: { type: String, required: true },
  role: {
    type: String,
    default: "doctor",
    // required: [true, "Role is required"],  
  },

  // 👇 Password field with validation
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },

  availability: [
    {
      day: { type: String, required: true },
      slots: [{ type: String, required: true }],
      available: { type: Boolean, default: true },
    },
  ],
});

module.exports = mongoose.model("Doctor", DoctorSchema);






