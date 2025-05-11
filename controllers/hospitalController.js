const express = require("express");
const Hospital = require("../model/HospitalSchema");
const router = express.Router();

// API to add multiple hospitals
const addHospitals = async(req, res) => {
  try {
    const hospitals = req.body; // Expecting an array of hospital objects
    if (!Array.isArray(hospitals) || hospitals.length === 0) {
      return res.status(400).json({ message: "Invalid input. Provide an array of hospital objects." });
    }

    const newHospitals = await Hospital.insertMany(hospitals);
    res.status(201).json({ message: "Hospitals added successfully", data: newHospitals });
  } catch (error) {
    console.error("Error adding hospitals:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getHospitalsByCity = async (req, res) => {
  try {
    const { id: city } = req.params; // Extract city from URL params
    console.log("city name is:",city);

    let hospitals;

    if (city && city.toLowerCase() !== "all") {
      // If city is not "all", filter hospitals where Address1 contains city name
      hospitals = await Hospital.find({ Address1: { $regex: city, $options: "i" } });
    } else {
      // If city is "all", return hospitals with rating > 4.5
      console.log("i am from all");
      hospitals = await Hospital.find({ Total_score: { $gt: 4.5 } });
    }

    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hospitals", error });
  }
};


const getHospitalData = async(req,res) => {
  try {
    console.log("req.params.id is:",req.params);
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res.json(hospital);
  } catch (error) {
    console.error("Error fetching hospital:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const getUniqueSpecialities = async (req, res) => {

  const {hospitalId} = req.params;

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

const getImage = async(req,res) => {
  const { url } = req.query;
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    res.set("Content-Type", "image/jpeg");
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching image" });
  }
}

module.exports = {addHospitals,getHospitalsByCity,getImage,getHospitalData,getUniqueSpecialities};
