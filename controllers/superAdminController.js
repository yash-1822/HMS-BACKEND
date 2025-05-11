const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Hospital = require("../model/HospitalSchema");
const Doctor = require("../model/DoctorSchema");
const HospitalAdmin = require("../model/hospitalAdminSchema")
const Appointment = require("../model/AppointmentSchema")
const SuperAdmin = require("../model/superAdmin")

const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
    
        // Check if user already exists
        const existingAdmin = await SuperAdmin.findOne({ email });
        if (existingAdmin) {
          return res.status(400).json({ message: 'Email already registered' });
        }
    
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        // Create the SuperAdmin
        const newAdmin = new SuperAdmin({
          name,
          email,
          password: hashedPassword,
          phone,
          role: "super_admin",
        });
    
        await newAdmin.save();
    
        res.status(201).json({ message: 'Super Admin registered successfully' });
      } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
      }
};


// const getAllHospitals = async(req,res) => {
//     try {
//       const hospital = await Hospital.find({});
//       if (!hospital) {
//         return res.status(404).json({ message: "Hospital not found" });
//       }
//       res.json(hospital);
//     } catch (error) {
//       console.error("Error fetching hospital:", error);
//       res.status(500).json({ message: "Server error" });
//     }
// }


const getAllHospitals = async(req, res) => {
  try {
    const hospital = await Hospital.find({});
    if (!hospital || hospital.length === 0) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }
    res.json({ success: true, data: hospital });
  } catch (error) {
    console.error("Error fetching hospital:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const updateHospitalApproval = async (req, res) => {
  try {
    const { hospitalId, isApproved } = req.body;
    let isPending = false;

    if (!hospitalId) {
      return res.status(400).json({ success: false, message: "Hospital ID is required" });
    }

    const updatedHospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { isApproved,isPending },
      { new: true }
    );

    if (!updatedHospital) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }

    res.status(200).json({ success: true, message: "Hospital approval updated", data: updatedHospital });
  } catch (error) {
    console.error("Error updating approval:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const getHospitalById = async (req, res) => {
  try {
    const { id } = req.params;
    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    return res.status(200).json({ success: true, data: hospital });
  } catch (error) {
    console.error("Error fetching hospital:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};




module.exports = {register,getAllHospitals,updateHospitalApproval,getHospitalById};
