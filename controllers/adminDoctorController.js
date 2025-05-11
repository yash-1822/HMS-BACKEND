const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Hospital = require("../model/HospitalSchema");
const Doctor = require("../model/DoctorSchema");
// const User = require("../models/User");
const HospitalAdmin = require("../model/hospitalAdminSchema")
const Appointment = require("../model/AppointmentSchema")
const SuperAdmin = require('../model/superAdmin')

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    // 1️⃣ Check in Hospital collection
    
    const doctor = await Doctor.findOne({ email });
    const hospitalAdmin = await HospitalAdmin.findOne({ email })
    const superAdmin = await SuperAdmin.findOne({ email })
    const hospital = await Hospital.findOne({ email });

    console.log(doctor,hospitalAdmin,superAdmin,hospital)


    if (doctor) {
      const isMatch = await bcrypt.compare(password, doctor.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect password" });
      }

      const token = jwt.sign(
        { _id: doctor._id, email: doctor.email, role: "doctor" },
        process.env.SECRET_KEY,
        { expiresIn: "8h" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        role: "doctor",
        user: {
          _id: doctor._id,
          email: doctor.email,
          name: doctor.name,
        },
        expires: new Date(Date.now() + 1000 * 60 * 60 * 8),
        success: true,
        error: false,
      });
    }


    if (hospitalAdmin) {
      console.log(hospitalAdmin.password)
      const isMatch = await bcrypt.compare(password, hospitalAdmin.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect password" });
      }

      const token = jwt.sign(
        { _id: hospitalAdmin._id, email: hospitalAdmin.email, role: "hospital_admin" },
        process.env.SECRET_KEY,
        { expiresIn: "8h" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        role: "hospital_admin",
        user: {
          _id: hospitalAdmin._id,
          email: hospitalAdmin.email,
          name: hospitalAdmin.name,
        },
        expires: new Date(Date.now() + 1000 * 60 * 60 * 8),
        success: true,
        error: false,
      });
    }


    if (superAdmin) {
      const isMatch = await bcrypt.compare(password, superAdmin.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect password" });
      }

      const token = jwt.sign(
        { _id: superAdmin._id, email: superAdmin.email, role: superAdmin.role },
        process.env.SECRET_KEY,
        { expiresIn: "8h" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        role: superAdmin.role,
        user: {
          _id: superAdmin._id,
          email: superAdmin.email,
          name: superAdmin.name,
        },
        expires: new Date(Date.now() + 1000 * 60 * 60 * 8),
        success: true,
        error: false,
      });
    }

    // ❌ Not found in any collection
    return res.status(404).json({ error: "User not found" });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};




const verifyUser = async (req, res) => {
  const aToken = req.headers.atoken;
  const dToken = req.headers.dtoken;

  console.log('data is',aToken,dToken)

  try {
    if (aToken) {
      const decoded = jwt.verify(aToken, process.env.SECRET_KEY);
      const user = await Hospital.findById(decoded.id);
      if (!user) return res.status(404).json({ success: false, message: "Admin not found" });

      return res.json({
        success: true,
        role: "admin",
        user,
      });
    }

    if (dToken) {
      const decoded = jwt.verify(dToken, process.env.SECRET_KEY);
      console.log("decoded data is:",decoded)
      const user = await Doctor.findById(decoded._id);
      console.log("user data is:",user.availability[0].slots);
      if (!user) return res.status(404).json({ success: false, message: "Doctor not found" });

      return res.json({
        success: true,
        role: "doctor",
        user,
      });
    }

    return res.status(401).json({ success: false, message: "No token provided" });
  } catch (err) {
    console.error("Verify user error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};


const updateDayAvailability = async(req,res) => {
  try {
    const { doctorId, day, available } = req.body
    console.log("requested body is",req.body)

    if (!doctorId || !day || typeof available !== 'boolean') {
      return res.status(400).json({ success: false, message: 'Missing or invalid fields' })
    }

    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' })
    }

    const availabilityDay = doctor.availability.find(d => d.day === day)
    if (!availabilityDay) {
      return res.status(404).json({ success: false, message: 'Day not found in availability' })
    }

    availabilityDay.available = available

    await doctor.save()

    res.status(200).json({ success: true, message: `Availability for ${day} updated successfully` })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}


const getAppointments = async(req,res) => {
  const { email } = req.body; // Get email from the request body
  console.log("email is:",email)

  try {
    const appointments = await Appointment.find({ 'docData.email': email }) .sort({ slotDate: -1 }) // Optional: sorts by latest first
    .limit(6); ;
    res.status(200).json({ success: true, appointments});
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}


const getAppointmentsAll = async(req,res) => {
  const { email } = req.body; // Get email from the request body
  console.log("email is:",email)

  try {
    const appointments = await Appointment.find({ 'docData.email': email });
    res.status(200).json({ success: true, appointments });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

const cancelAppointment = async (req,res) => {
  try {

    const {appointmentId} = req.body

    const appointmentData = await Appointment.findById(appointmentId)

    if (appointmentData) {
      
      await Appointment.findByIdAndUpdate(appointmentId, {cancelled: true})
      return res.json({success: true, message:'Appointment cancelled'})

    }

    else {
      return res.json({success: flase, message:'cancellation failed'})

    }

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  
  }
}



const completeAppointment = async (req,res) => {
  try {

    const {appointmentId} = req.body

    const appointmentData = await Appointment.findById(appointmentId)

    if (appointmentData) {
      
      await Appointment.findByIdAndUpdate(appointmentId, {isCompleted: true})
      return res.json({success: true, message:'Appointment completed'})

    }

    else {
      return res.json({success: flase, message:'Mark failed'})

    }

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  
  }
}


const getAppointmentStats = async (req, res) => {
  // try {
  //   // Fetch all appointments
  //   const appointments = await Appointment.find();

  //   // Total earnings from completed appointments
  //   const totalEarnings = appointments
  //     .filter(app => app.isCompleted)
  //     .reduce((sum, app) => sum + (app.amount || 0), 0);

  //   // Total number of appointments
  //   const totalAppointments = appointments.length;

  //   // Unique patient emails (assuming userData.email exists)
  //   const uniquePatientEmails = new Set(
  //     appointments.map(app => app.userEmail).filter(Boolean)
  //   );

  //   console.log(uniquePatientEmails.size)
  //   const totalPatients = uniquePatientEmails.size;

  //   // Send response
  //   return res.status(200).json({
  //     success: true,
  //     totalEarnings,
  //     totalAppointments,
  //     totalPatients
  //   });

  // } catch (error) {
  //   console.error("Error getting appointment stats:", error);
  //   res.status(500).json({ success: false, message: "Server Error" });
  // }


  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Replace with your actual secret

    const doctorEmail = decoded.email; // assuming token has email
    if (!doctorEmail) {
      return res.status(400).json({ success: false, message: 'Invalid token: no email found' });
    }

    // Fetch appointments for the doctor
    const appointments = await Appointment.find( { 'docData.email': doctorEmail } );
    console.log("appointmrnts",appointments)

    // Total earnings from completed appointments
    const totalEarnings = appointments
      .filter(app => app.isCompleted)
      .reduce((sum, app) => sum + (app.amount || 0), 0);

    // Total number of appointments
    const totalAppointments = appointments.length;

    // Unique patient emails
    const uniquePatientEmails = new Set(
      appointments.map(app => app.userEmail).filter(Boolean)
    );

    const totalPatients = uniquePatientEmails.size;

    return res.status(200).json({
      success: true,
      totalEarnings,
      totalAppointments,
      totalPatients
    });

  } catch (error) {
    console.error("Error getting appointment stats:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


const addDoctor = async (req, res) => {
  try {

    const token = req.headers.atoken;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: Token missing" });
    }

    // Replace 'your-secret-key' with your actual JWT secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const hospitalAdminId = decoded._id;

    console.log(decoded)

    const hospitalAdmin = await HospitalAdmin.findById(hospitalAdminId).select("hospital");
    console.log("id is",hospitalAdmin.hospital)

    if (!hospitalAdmin) {
      return res.status(404).json({ success: false, message: "Hospital admin not found" });
    }

    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      gender,
      contact,
      bodyPart,
      operations,
      availability,
      image,
    } = req.body;

    console.log("Received:", req.body);

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !image) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 6) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    // No image validation or upload here

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctorData = {
      name,
      email,
      doctor_image:image,
      password: hashedPassword,
      specialty:speciality,
      qualification:degree,
      experience,
      about,
      consultancyFees:fees,
      location:address,
      gender,
      contact,
      bodyPart,
      noOfOps:operations,
      availability,
      // hospital:hospitalAdmin
      hospital:hospitalAdmin.hospital
      // date: Date.now(),
    };

    const newDoctor = new Doctor(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor Added" });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};



module.exports = {login,getAppointmentsAll,verifyUser,addDoctor,getAppointmentStats,updateDayAvailability,getAppointments,cancelAppointment,completeAppointment};
