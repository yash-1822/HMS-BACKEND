const express = require("express");
const Doctor = require("../model/DoctorSchema");
const appointmentModel = require("../model/AppointmentSchema")
const router = express.Router();

const getDoctors = async (req, res) => {
    try {
      const { id: city } = req.params;
      // const doctors = await Doctor.find();

      let doctors;

      console.log("city is from doctors",city)
      
          if (city && city.toLowerCase() !== "all") {
            // If city is not "all", filter hospitals where Address1 contains city name
            doctors = await Doctor.find({ location: { $regex: city, $options: "i" } });
          } else {
            // If city is "all", return hospitals with rating > 4.5
            doctors = await Doctor.find({ ratings: { $gt: 4.2 } });
          }

      res.status(200).json(doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      res.status(500).json({ message: "Failed to fetch doctors." });
    }
};




const getDoctorsByHospitalId = async(req,res) => {
  try {
    const { id:hospitalId } = req.params; // Extract hospitalId from the request parameters

    if (!hospitalId) {
      return res.status(400).json({ message: "Hospital ID is required" });
    }

    // Find doctors associated with the given hospitalId and populate the hospital details
    let doctors = await Doctor.find({ hospital: hospitalId }).populate("hospital");

    if (doctors.length === 0) {
      doctors = await Doctor.find().populate("hospital");
    }

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

const getDoctorsByCity = async (req, res) => {
  try {
    const { id: city } = req.params;
    console.log("City is from getDoctorsByCity",city)
    let doctors;
    if (city === "all") {
      // If the city is "all", fetch all doctors
      doctors = await Doctor.find().populate("hospital");
    } else {
      // If city is provided, fetch all doctors and then filter by the hospital's Location
      doctors = await Doctor.find().populate("hospital");
      // console.log("doctors data is:",doctors);
      doctors = doctors.filter(doctor => {
        return doctor.hospital && doctor.hospital.Address1.toLowerCase().includes(city.toLowerCase());
      });
      
    }

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



const addAppointment = async (req, res) => {
  try {
    const {
      email,
      date,
      slot,
      docData,
      amount,
      phone,
      patientName,
      payment,
    } = req.body;


 

    const newAppointment = new appointmentModel({
      userEmail:email,
      slotDate:date,
      slotTime:slot,
      docData,
      phone,
      name:patientName,
      amount,
      payment
    });

    await newAppointment.save();

    res.json({ success: true, message: "Appointment added successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};




const getUniqueSpecialities = async (req, res) => {
 
  const hospitalId = req.params.id;

  try {
    const hospital = await Hospital.findById(hospitalId, "specializations"); // Fetch only the 'specializations' field

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.status(200).json({ specializations: hospital.specializations });
  } 
  catch (error) {
    console.error("Error fetching specialities:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getDoctorById = async(req,res) => {
  try {
    console.log("i am in yash")
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


const getRelatedDoctors = async(req,res) => {
  try {
    // console.log("requested query is:",req.query);
    // const { specialty, exclude } = req.query;
    const { specialty, exclude } = req.body;
    console.log("speciality,exclude are:",specialty,exclude)
    if (!specialty) return res.status(400).json({ message: "Speciality is required" });

    const relatedDoctors = await Doctor.find({
      specialty,
      _id: { $ne: exclude }, // Exclude the current doctor
    }).limit(5);

    console.log(relatedDoctors)

    res.status(200).json(relatedDoctors);
  } catch (error) {
    console.error("Error fetching related doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
}



const getBookedSlots = async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;
  const formattedDate = date.replace(/-/g, '/');

  console.log("formattedDate is",formattedDate);

  try {
    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });


    // const appointments = await appointmentModel.find({ "docData.email": doctorEmail })
    // .select('slotDate slotTime -_id')
    // .lean();
    const appointments = await appointmentModel.find({ "docData.email": doctor.email})

    const bookedSlots = appointments
      .filter(app => app.slotDate === formattedDate)
      .map(app => app.slotTime);

    console.log("booked slots are:",bookedSlots);  

    return res.status(200).json(bookedSlots);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = {getBookedSlots,addAppointment,getDoctors,getDoctorsByCity,getUniqueSpecialities,getDoctorById,getRelatedDoctors,getDoctorsByHospitalId}